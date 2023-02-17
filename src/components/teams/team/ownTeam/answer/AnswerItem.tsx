import { List, Space } from 'antd';
import { IAnswerDetails } from '../../../../../types/interfaces';
import dateConverter from '../../../../../utils/dateConverter';

const AnswerItem = (answer: IAnswerDetails) => {
  let isAnswerNotSubmitted = false;

  for (const answerItem of answer.answer) {
    const answer = Object.values(answerItem);
    if (!answer.join('')) {
      isAnswerNotSubmitted = true;
    }
  }

  const date = dateConverter(answer.time);

  return (
    <div className='answer'>
      <Space direction='vertical'>
        <h3>
          {answer.name}: {date}{' '}
          {isAnswerNotSubmitted && <span> | Not submitted yet</span>}
        </h3>

        <List>
          {answer.answer.map((answerItem, index) => {
            const questions = Object.keys(answerItem);
            const answers = Object.values(answerItem);

            return (
              <List.Item key={index}>
                {questions[0] && (
                  <div>
                    <h4>Q. {questions[0]}</h4>
                    <p>A. {answers[0]}</p>
                  </div>
                )}

                {questions[1] && (
                  <div>
                    <h4>Q. {questions[1]}</h4>
                    <p>A. {answers[1]}</p>
                  </div>
                )}

                {questions[2] && (
                  <div>
                    <h4>Q. {questions[2]}</h4>
                    <p>A. {answers[2]}</p>
                  </div>
                )}
              </List.Item>
            );
          })}
        </List>
      </Space>
    </div>
  );
};

export default AnswerItem;
