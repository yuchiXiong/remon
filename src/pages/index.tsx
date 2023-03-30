import Head from 'next/head';
import { PauseOne, Play } from '@icon-park/react';
import { useState } from 'react';
import getQuestion, { IQuestion, IQuestionOptions } from '@/utils/question';

export function getServerSideProps() {

  const question = getQuestion();

  return {
    props: {
      question,
    }
  }
}

/** 
 * @description: 首页 - 答题
 */
export default function HomePage({ question: initQuestion }: { question: IQuestion }) {

  /** 当前题目对象 */
  const [question, setQuestion] = useState<IQuestion>(initQuestion);
  /** 用户当前选项 */
  const [selected, setSelected] = useState<'' | IQuestionOptions>('');
  /** 当前正在播放的语音类型 */
  const [playing, setPlaying] = useState<'' | 'Q' | IQuestionOptions>('');
  /** 当前页面状态 WAIT_SELECT => 等待用户选择选项 WAIT_NEXT => 等待用户点击下一题 */
  const [currentStatus, setCurrentStatus] = useState<'WAIT_SELECT' | 'WAIT_NEXT'>('WAIT_SELECT');

  /** 播放音频 */
  const handlePlay = (url: string, key: 'Q' | IQuestionOptions) => {
    const audio = new Audio(url);
    setPlaying('Q');
    audio.play();
    audio.onpause = () => setPlaying('');
  };

  /** 提交 */
  const handleSubmit = () => {
    if (selected === '') return;

    if (currentStatus === 'WAIT_SELECT') {
      setCurrentStatus('WAIT_NEXT');
      setQuestion({
        ...question,
        userAnswer: selected,
      });
      const audio = new Audio(question.sound);
      audio.play();
    } else {
      setCurrentStatus('WAIT_SELECT');
      setQuestion(getQuestion());
      setSelected('');
    }
  };

  /** 选择选项，如果选项是发音，点击的时候播放发音 */
  const handleSelect = (key: IQuestionOptions) => {
    setSelected(key);
    if (question.options[key].includes('mp3')) {
      handlePlay(question.options[key], key);
    }
  };


  return (
    <>
      <Head>
        <title>练习 | 柠檬五十音</title>
        <meta name="description" content="An application to help memorize the gojuon." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='flex flex-col items-center justify-center h-screen p-10'>

        <p className='mt-10 text-xl font-medium text-gray-600'>{question.title}</p>
        <div className='py-8 text-sky-900'>
          {question.item.includes('mp3') ? (
            playing === 'Q' ? (
              <PauseOne
                onClick={() => handlePlay(question.item, 'Q')}
                theme="filled"
                size="32"
                fill="#333"
              />
            ) : (
              <Play
                onClick={() => handlePlay(question.item, 'Q')}
                theme="filled"
                size="32"
                fill="#333"
              />
            )
          ) : (
            <div className='text-3xl'>{question.item}</div>
          )}
        </div>

        <ul className='w-full'>
          {Object.keys(question.options).map(key => (
            <li
              key={key}
              onClick={() => handleSelect(key as IQuestionOptions)}
              className={`py-2 bg-gray-100 text-gray-700 
              font-light rounded-full w-full mx-auto mb-4 flex items-center 
              justify-center text-2xl 
              ${currentStatus === "WAIT_SELECT" && selected === key && 'bg-pink-200 text-pink-500 '}
              ${currentStatus === "WAIT_NEXT" && question.answer === key && 'bg-green-300 '}
              ${currentStatus === "WAIT_NEXT" && question.userAnswer === key && question.answer !== key && 'bg-red-300 text-pink-500 '}
              `}
            >
              {question.options[key as IQuestionOptions].includes('mp3') ? (
                playing && selected === key ? (
                  <PauseOne
                    onClick={() => handlePlay(question.options[key as IQuestionOptions], key as IQuestionOptions)}
                    theme="filled"
                    size="32"
                    fill="#333"
                  />
                ) : (
                  <Play
                    onClick={() => handlePlay(question.options[key as IQuestionOptions], key as IQuestionOptions)}
                    theme="filled"
                    size="32"
                    fill="#333"
                  />
                )
              ) : (
                question.options[key as IQuestionOptions]
              )}
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubmit}
          className='w-full p-3 mt-auto text-white bg-pink-700 rounded-full'
        >{currentStatus === 'WAIT_NEXT' ? '下一题' : '提交'}</button>

      </main>
    </>
  )
}
