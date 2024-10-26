import ActionCell from "layouts/ecommerce/products/products-list/components/ActionCell";
import axios from "axios";

// ... other imports
const baseUrl = process.env.REACT_APP_BASE_URL; // Assuming variable name is REACT_APP_BASE_URL

const authAxios = axios.create({
  baseURL: baseUrl,
});

authAxios.interceptors.request.use(
  (config) => {
    return new Promise((resolve) => {
      const token = sessionStorage.getItem("pdf_excel_hash");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      resolve(config); // Resolve the promise with the modified config
    });
  },
  (error) => Promise.reject(error)
);

const DataTable = () => {
  const [dataTableData, setDataTableData] = useState({
    columns: [
      { Header: "Ser", accessor: "ser" },
      { Header: "Username", accessor: "username" },
      { Header: "Role", accessor: "role" },
      { Header: "Status", accessor: "status" },
      { Header: "Action", accessor: "action" },
    ],
    rows: [], // Initially empty array
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authAxios.get("/api/users_list");

        if (!response.data || !response.data.users) {
          console.warn(
            "Empty response or missing 'users' property in response.data"
          );
          return [];
        }

        const formattedData = response.data.users.map((item, index) => ({
          ser: index + 1,
          username: item.username,
          role: item.role,
          status: item.status,
          action: <ActionCell />,
        }));

        setDataTableData((prevData) => ({
          ...prevData,
          rows: formattedData,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return dataTableData;
};

export default DataTable;
