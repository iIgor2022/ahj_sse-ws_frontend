export default function formatDate(fullDate) {
  const date = new Date(fullDate);
  const day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
  const month =
    date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
  const hour =
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minute =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const fullTime = `${hour}:${minute}`;
  return `${hour}:${minute} ${day}.${month}.${date.getFullYear}`;
}
