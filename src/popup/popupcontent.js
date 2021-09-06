import React, { useState, useEffect } from "react";
import "./popup.scss";
import { Carousel } from "react-carousel-minimal";
import { useHistory } from "react-router-dom";
import close from "../img/close.svg";
import ok from "../img/ok.svg";
import time from "../img/delivery-time-tool.svg";

function Popupcontent() {
  const [product, setProduct] = useState([]);
  const [title, setTitle] = useState("");
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState("");
  const [versions, setVersions] = useState([]);
  const [price, setPrice] = useState("");
  const [count, setCount] = useState(1);
  const [amount, setAmount] = useState(false);
  const [list, setList] = useState([]);

  const history = useHistory();

  const img = [
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/1200px-GoldenGateBridge-001.jpg",
    },
    {
      image:
        "https://cdn.britannica.com/s:800x450,c:crop/35/204435-138-2F2B745A/Time-lapse-hyper-lapse-Isle-Skye-Scotland.jpg",
    },
    {
      image:
        "https://static2.tripoto.com/media/filter/tst/img/735873/TripDocument/1537686560_1537686557954.jpg",
    },
  ];

  useEffect(() => {
    fetch("http://localhost:8000/product", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setProduct([data]);
        setTitle(data.name);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/sizes", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setSizes([data]);
        setSize(data.items.U.name);
        setPrice(data.items.U.price);
        setAmount(data.items.U.amount);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/multiversions", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setVersions(data);
      });
  }, []);

  const HandleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:7000/list", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ title, size, count }),
    }).then(() => history.push("/"));

    const data = {
      title: title,
      size: size,
      count: count,
    };

    const newListassets = [...list, data];
    setList(newListassets);
  };
  console.log(list);

  return (
    <>
      <div className="content">
        <Carousel
          data={img}
          time={2000}
          width="305px"
          height="235px"
          slideBackgroundColor="white"
          pauseIconColor="black"
          pauseIconSize="20px"
          slideImageFit="cover"
          thumbnailWidth="100px"
          style={{
            textAlign: "center",
            color: "black",
            marginTop: "39px",
            marginBottom: "63px",
          }}
        />

        {sizes.map((size) => {
          let sizeKeys = Object.keys(size.items);

          let Buttons = sizeKeys.map((t) => (
            <button
              className="buttonSize"
              type="button"
              onClick={() => {
                setPrice(size.items[t].price);
                setAmount(size.items[t].amount);
                setCount(1);
                setSize(size.items[t].name);
              }}
            >
              {size.items[t].name}
            </button>
          ));

          const Title = product.map((row) => (
            <div className="titleContainer">
              <p id={row.id} className="prodTitle">
                {title}
              </p>
            </div>
          ));

          const Version = versions.map((version) => {
            const onChange = (e) => {
              const valueSelectedByUser = parseInt(e.target.value);
              setPrice(price + valueSelectedByUser);
            };
            return (
              <select onChange={onChange}>
                {Object.keys(version.items).map((item) => (
                  <option
                    value={version.items[item].products.map(
                      (prod) => prod.price_difference
                    )}
                  >
                    {Object.keys(version.items[item].values).map(
                      (id) => version.items[item].values[id].name
                    )}
                  </option>
                ))}
              </select>
            );
          });

          return (
            <form className="form" onSubmit={HandleSubmit}>
              <div>
                <div className="formHeader">
                  {Title}
                  <button type="button" className="closeButton">
                    <img src={close} alt="test" className="closeIcon" />
                  </button>
                </div>
                <p className="price">
                  {new Intl.NumberFormat("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                    minimumFractionDigits: 2,
                  }).format(price * count)}
                </p>
                <p className="sizeTitle">Rozmiar:</p>
                <div className="buttonsGroup">{Buttons}</div>
                <div className="colorVersion">
                  <p className="colorTitle">Wariant:</p>
                  {Version}
                </div>
                <div>
                  {amount > 0 ? (
                    <div className="available">
                      <div className="availableContainer">
                        <img src={ok} alt="ok" className="okIcon" />
                        <p className="prodAvailable">Produkt dostępny</p>
                      </div>
                      <div className="sendInfo">
                        <img src={time} alt="time" className="timeIcon" />
                        <div className="send">
                          <p>Możemy wysłać już dzisiaj!</p>
                          <a href="url" className="sendUrl">
                            Sprawdź czasy i koszty wysyłki
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="notAvailable">Produkt niedostępny</div>
                  )}
                </div>
                <div className="formFooter">
                  <div className="counter">
                    <button
                      className="countDecrement"
                      type="button"
                      onClick={() =>
                        count > 1 ? setCount(count - 1) : setCount(1)
                      }
                    >
                      -
                    </button>
                    <div className="count">{count}</div>
                    <button
                      className="countIncrement"
                      type="button"
                      onClick={() =>
                        count < amount ? setCount(count + 1) : count
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="submit"
                    onClick={HandleSubmit}
                    className="submitButton"
                  >
                    Dodaj do koszyka
                  </button>
                </div>
              </div>
            </form>
          );
        })}
      </div>
    </>
  );
}

export default Popupcontent;
