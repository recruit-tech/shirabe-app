import { Scanner, Plugin, JSHandle } from "@shirabe/plugin";
import { v4 as uuid } from "uuid";

import type { Page, Reporter } from "@shirabe/plugin";

interface UseragentContent {
  message: string;
  stack: string[];
}

const generateDetectingScript = (target: string, prop: string, id: string) => `
  (function (target, prop) {
    let value = ${target}['${prop}'];
    Object.defineProperty(target, prop, {
      get: () => {
        try {
          throw new Error();
        } catch (e) {
          console.debug('${id}', 'get', '${prop}', e.stack);
        };
        return value;
      },
      set: v => {
        try {
          throw new Error();
        } catch (e) {
          console.debug('${id}', 'set', '${prop}', e.stack);
        };
        value = v;
      },
    });
  })(${target}, '${prop}');
`;

class UseragentScanner extends Scanner {
  id: string;

  constructor(reporter: Reporter) {
    super(reporter);
    this.id = uuid();
  }

  async beforeLoad(page: Page): Promise<void> {
    await Promise.all(
      ["userAgent", "appVersion", "platform"].map((prop) =>
        page.addInitScript(generateDetectingScript("navigator", prop, this.id))
      )
    );

    page.on("console", async (message) => {
      if (message.type() !== "debug") return;

      const [, access, prop, errorMessage] = await Promise.all(
        message.args().map((arg: JSHandle<string>) => arg.jsonValue())
      );
      const [, , ...stack] = errorMessage?.split("\n") ?? [];

      this.report<UseragentContent>({
        type: "useragent",
        payload: {
          message: `${access} navigator.${prop}`,
          stack: stack.map((s) => s.trimLeft()) ?? [],
        },
      });
    });
  }
}

export class UseragentPlugin extends Plugin {
  name = "useragent-plugin";

  createScanner(reporter: Reporter): Scanner {
    return new UseragentScanner(reporter);
  }
}
