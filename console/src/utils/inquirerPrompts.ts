import inquirer, { QuestionCollection, Answers } from 'inquirer';

class PromptService {
    private static instance: PromptService;

    private constructor() {}

    public static getInstance(): PromptService {
        if (!PromptService.instance) {
            PromptService.instance = new PromptService();
        }
        return PromptService.instance;
    }

    public async prompt(questions: QuestionCollection): Promise<Answers> {
        return inquirer.prompt(questions);
    }

    public async askMenuType(): Promise<string> {
        const { menu_type } = await this.prompt([
            {
                type: 'list',
                name: 'menu_type',
                message: 'Select menu type:',
                choices: ['breakfast', 'lunch', 'dinner'],
            },
        ]);
        return menu_type;
    }

    public async askCommand(): Promise<string> {
        const { command } = await this.prompt([
            {
                type: 'list',
                name: 'command',
                message: 'Choose an action:',
                choices: [
                    'Propose Daily Menu',
                    'Generate Monthly Feedback Report',
                    'View Feedback',
                    'Exit',
                ],
            },
        ]);
        return command;
    }

    public async askSelectedItems(choices: {name: string, value: number}){
        const { selectedItems } = await inquirer.prompt([
            {
                type: 'checkbox',
                name: 'selectedItems',
                message: 'Select up to 3 items:',
                choices: choices,
                validate: function (answer) {
                    if (answer.length > 3) {
                        return 'You can select up to 3 items only.';
                    }
                    if (answer.length < 1) {
                        return 'You must choose at least one item';
                    }
                    return true;
                }
            }
        ]);

        return selectedItems
    }
}

export default PromptService.getInstance();
