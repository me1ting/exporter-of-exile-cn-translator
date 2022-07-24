import { PassiveSkillProvider } from "../provider/passiveskill.provider";
import { Language } from "../type/language.type";

export class PassiveSkillService {
    private readonly passiveSkillProvider: PassiveSkillProvider;

    constructor(passiveSkillProvider: PassiveSkillProvider) {
        this.passiveSkillProvider = passiveSkillProvider;
    }

    public translateNotable(zh: string): string | null {
        const nodes = this.passiveSkillProvider.provideNotableByZhName(zh);
        /*
        if (notables.length === 0) {
            return null;
        } else if (notables.length === 1) {
            return notables[0].name[Language.English];
        } else {
            if (prompt) {
                let choice = -1;

                let promptTextBuf = [`请根据描述区分（输入序号）具有相同中文的天赋技能 ${zh}：`];
                let index = 0;
                for (let notable of notables) {
                    promptTextBuf.push(`    ${index}: ${notable.stats?.[Language.Chinese]}`);
                    index += 1;
                }
                let promptText = promptTextBuf.join('\n');

                while (choice < 0 || choice >= notables.length) {
                    let input = prompt(promptText);
                    if (input === null) {
                        choice = -1;
                        continue;
                    }

                    choice = parseInt(input, 10);
                    if (isNaN(choice)) {
                        choice = -1;
                    }
                }

                return notables[choice].name[Language.English];
            } else {
                return notables[0].name[Language.English];
            }
        }
        */
        if (nodes.length === 1) {
            return nodes[0].name[Language.English];
        }

        return null;
    }

    public translateKeystone(zh: string): string | null {
        const node = this.passiveSkillProvider.provideKeystoneByZhName(zh);
        if (node) {
            return node.name[Language.English];
        }

        return null;
    }

    public translateAscendant(zh: string): string | null {
        const nodes = this.passiveSkillProvider.provideAscendantByZhName(zh);
        if (nodes.length === 1) {
            return nodes[0].name[Language.English];
        }

        return null;
    }
}