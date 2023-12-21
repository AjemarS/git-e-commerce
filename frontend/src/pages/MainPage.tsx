import Shop from "../components/Shop";
import Filters from "../components/Filters";

const MainPage: React.FC = () => {

  return (
    <main>
      <Filters />
      <Shop />
    </main>
  );
};

export default MainPage;
