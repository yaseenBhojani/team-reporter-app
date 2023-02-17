const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const dateConverter = (time: number) => {
  var date = new Date(time);

  // ~ if year is equal to current year then no need to show year
  const year =
    date.getFullYear() === new Date().getFullYear() ? '' : date.getFullYear();

  return `${date.getDate()}th ${monthNames[date.getMonth()]} ${year}`;
};

export default dateConverter;
