import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 50;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  // Add To Cart
  const addToCart = useCallback(
    async (itemId, size) => {
      if (!size) {
        toast.error("Please Select Product Size");
        return;
      }

      let cartData = structuredClone(cartItems);

      if (cartData[itemId]) {
        if (cartData[itemId][size]) {
          cartData[itemId][size] += 1;
        } else {
          cartData[itemId][size] = 1;
        }
      } else {
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
      }

      setCartItems(cartData);

      if (token) {
        try {
          await axios.post(
            backendUrl + "/api/cart/add",
            { itemId, size },
            { headers: { token } }
          );
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    },
    [backendUrl, cartItems, token]
  );

  // Update Quantity
  const updateQuantity = useCallback(
    async (itemId, size, quantity) => {
      let cartData = structuredClone(cartItems);

      if (cartData[itemId]) {
        cartData[itemId][size] = quantity;
      }

      setCartItems(cartData);

      if (token) {
        try {
          await axios.post(
            backendUrl + "/api/cart/update",
            { itemId, size, quantity },
            { headers: { token } }
          );
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    },
    [backendUrl, cartItems, token]
  );

  const getUserCart = useCallback(
    async (token) => {
      if (!token) return;

      try {
        const response = await axios.post(
          backendUrl + '/api/cart/get',
          {},
          { headers: { token } }
        );

        if (response.data.success) {
          setCartItems(response.data.cartData);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    },
    [backendUrl]
  );

  // Cart Count
  const getCartCount = useCallback(() => {
    let totalCount = 0;

    for (const item in cartItems) {
      for (const size in cartItems[item]) {
        try {
          if (cartItems[item][size] > 0) {
            totalCount += cartItems[item][size];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return totalCount;
  }, [cartItems]);

  // Cart Amount
  const getCartAmount = useCallback(() => {
    let totalAmount = 0;

    for (const item in cartItems) {
      let itemInfo = products.find(
        (product) => product._id === item
      );

      if (!itemInfo) continue;

      for (const size in cartItems[item]) {
        try {
          if (cartItems[item][size] > 0) {
            totalAmount +=
              itemInfo.price * cartItems[item][size];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    return totalAmount;
  }, [cartItems, products]);

  // Fetch Products
  const getProductData = useCallback(async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/product/list"
      );

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl]);

  // Load Products
  useEffect(() => {
    getProductData();
  }, [getProductData]);

  // Load Token
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      getUserCart(savedToken);
    }
  }, [getUserCart]);

  const value = useMemo(
    () => ({
      products,
      currency,
      delivery_fee,
      search,
      showSearch,
      setSearch,
      setShowSearch,
      cartItems,
      setCartItems,
      addToCart,
      updateQuantity,
      getCartCount,
      getCartAmount,
      navigate,
      backendUrl,
      token,
      setToken,
    }),
    [
      products,
      cartItems,
      search,
      showSearch,
      token,
      getCartCount,
      getCartAmount,
      navigate,
      backendUrl,
      addToCart,
      updateQuantity,
    ]
  );

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;