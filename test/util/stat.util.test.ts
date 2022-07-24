import { StatUtil } from "../../src/util/stat.util";

function testGetBodyOfTemplate() {
    const testcases = [
        { "t": "^(\\S+) 最大生命$", "body": "# 最大生命" },
        { "t": "^每 6 秒获得 (\\S+) 个耐力球、狂怒球或暴击球$", "body": "每 # 秒获得 # 个耐力球、狂怒球或暴击球" },
        { "t": "^增加的小天赋还获得：(\\S+) 力量$", "body": "增加的小天赋还获得：# 力量" },
        {"t": "^持双手武器时附加 (\\S+) 到 (\\S+) 点火焰法术伤害$", "body": "持双手武器时附加 # 到 # 点火焰法术伤害" }
    ];

    for (const testcase of testcases) {
        const template = testcase["t"];
        const body = testcase["body"];

        test(`get body of template: ${template} to ${body}`, () => {
            expect(StatUtil.getBodyOfTemplate(template)).toBe(body);
        });
    }
}

function testGetBodyOfModifier() {
    const testcases = [
        { "m": "增加的小天赋还获得：+8 力量", "body": "增加的小天赋还获得：# 力量" },
        { "m": "持双手武器时附加 12 到 16 点火焰法术伤害", "body": "持双手武器时附加 # 到 # 点火焰法术伤害" }
    ];

    for (const testcase of testcases) {
        const modifier = testcase["m"];
        const body = testcase["body"];

        test(`get body of modifier: ${modifier} to ${body}`, () => {
            expect(StatUtil.getBodyOfModifier(modifier)).toBe(body);
        });
    }
}

testGetBodyOfTemplate();
testGetBodyOfModifier();