import gojuon from '@/data/gojuon';

export interface IQuestion {
  title: string,
  item: string,
  options: Record<IQuestionOptions, string>,
  answer: IQuestionOptions,
  userAnswer: '' | IQuestionOptions,
  sound: string
}

export type IQuestionOptions = 'A' | 'B' | 'C' | 'D';

/**
 * @description 随机获取一个问题
 *  1. 根据罗马音选择平假名
 *  2. 根据罗马音选择片假名
 *  3. 根据罗马音选择正确的读音
 *  4. 根据平假名选择罗马音
 *  5. 根据平假名选择片假名
 *  6. 根据平假名选择正确的读音
 *  7. 根据片假名选择罗马音
 *  8. 根据片假名选择平假名
 *  9. 根据片假名选择正确的读音
 *  10. 根据正确的读音选择罗马音
 *  11. 根据正确的读音选择平假名
 *  12. 根据正确的读音选择片假名
 */
const questionEnum = [
  { key: 'roomaji', name: '罗马音' },
  { key: 'hiragana', name: '平假名' },
  { key: 'katakana', name: '片假名' },
  { key: 'sound', name: '读音' },
] as const;

const all = [...gojuon.youonn, ...gojuon.dakuonn, ...gojuon.seionn].filter(i => i);
const getQuestion = (): IQuestion => {

  const question: IQuestion = {
    title: '',
    item: '',
    options: {
      A: '',
      B: '',
      C: '',
      D: '',
    },
    answer: 'A',
    userAnswer: '',
    sound: '',
  };

  /** 随机从罗马音/平假名/片假名/读音中选择一个作为题目类型 */
  const questionType = Math.floor(Math.random() * 4) as 0 | 1 | 2 | 3;
  /** 过滤掉上述类型以后随机从罗马音/平假名/片假名/读音中选择一个作为答案类型 */
  const answerType = new Array(4).fill(0).map((_, index) => index).filter(i => i !== questionType)[Math.floor(Math.random() * 3)] as 0 | 1 | 2 | 3;

  /** 随机选择四组用于答案和题目的五十音图元素 */
  const options: (typeof all[0])[] = [];
  while (options.length < 4) {
    const option = all[Math.floor(Math.random() * all.length)] as Required<typeof all[0]>;
    if (!options.includes(option) && option[questionEnum[questionType].key] && option[questionEnum[answerType].key]) {
      options.push(option);
      question.options['ABCD'[options.length - 1] as IQuestionOptions] = option[questionEnum[answerType].key];
    }
  }

  /** 随机选择一个作为题目 */
  const correctIndex = Math.floor(Math.random() * 4);
  const answerItem = options[correctIndex] as Required<typeof options[0]>;

  question.item = answerItem[questionEnum[questionType].key];
  question.title = `根据${questionEnum[questionType].name}选择对应的${questionEnum[answerType].name}`;
  question.answer = ['A', 'B', 'C', 'D'][correctIndex] as IQuestionOptions;
  question.sound = answerItem.sound;

  return question;
}

export default getQuestion;