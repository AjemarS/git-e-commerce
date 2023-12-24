import Shop from "./Shop/Shop";
import Filters from "./Filters/Filters";

const MainPage: React.FC = () => {
  return (
    <main>
      <Filters />
      <Shop />
    </main>
  );
};

export default MainPage;
