import Shop from "./Shop/Shop";
import Filters from "./Filters/Filters";
import { useLocation } from "react-router-dom";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const MainPage: React.FC = () => {
  // Отримуємо стрічку запиту саме тут, щоб передбачити баги з оновленням компонентів
  const query = useQuery().toString();
  
  return (
    <main>
      <Filters />
      <Shop query={query} />
    </main>
  );
};

export default MainPage;
