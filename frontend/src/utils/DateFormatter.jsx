const DateFormatter = ({ date }) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date(date))
    .replace(",", "")
    .replace(" AM", "am")
    .replace(" PM", "pm");

  return <span className="text-sm text-gray-500">Due: {formattedDate}</span>;
};

export default DateFormatter;
