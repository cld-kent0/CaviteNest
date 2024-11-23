interface DashboardCardProps {
  title: string;
  value: string | number; // Allow both string and number
}

const DashboardCard = ({ title, value }: DashboardCardProps) => {
  return (
    <div className="card bg-white shadow-sm items-center p-4 text-center rounded-lg">
      <div className="font-bold mb-2">{title}</div>
      <div className="font-semibold mb-2 text-center">{value}</div>
      {/* <h3>{title}</h3> */}
      {/*<p>{value}</p>  Can be a number or string now */}
    </div>
  );
};

export default DashboardCard;
