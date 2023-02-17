import { useState } from 'react';

import { DatePicker, DatePickerProps } from 'antd';

import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import AnswerItem from './answer/AnswerItem';

const Reports = () => {
  const { answers: allAnswers } = useSelector(
    (state: RootState) => state.ownTeam
  );
  const [selectedAnswers, setSelectedAnswers] = useState(allAnswers);

  const onChange: DatePickerProps['onChange'] = date => {
    console.log(typeof date?.date());
    if (!date) {
      setSelectedAnswers(allAnswers);
      return;
    }

    setSelectedAnswers(
      allAnswers?.filter(answer => {
        const selectDate = new Date(answer.time);
        const answerDate = `${selectDate.getDate()} ${selectDate.getMonth()} ${selectDate.getFullYear()}`;
        const calenderDate = `${date?.date()} ${date?.month()} ${date?.year()}`;

        if (answerDate === calenderDate) {
          return true;
        }
      })
    );
  };

  return (
    <div className='reports'>
      <DatePicker onChange={onChange} />

      {selectedAnswers &&
        selectedAnswers.map((answer, index) => (
          <AnswerItem {...answer} key={index} />
        ))}

      {selectedAnswers?.length === 0 && <h2>There are no answers</h2>}
    </div>
  );
};

export default Reports;
