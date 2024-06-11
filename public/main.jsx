const { useState, useEffect } = React;
const API_KEY = "30d38b26954359266708f92e1317dac0";

function App() {
  const [clima, setClima] = useState(null);
  const [ciudadSelec, setCiudadSelec] = useState("Tucuman");
  const [buscarInput, setBuscarInput] = useState("");
  const [historial, setHistorial] = useState([]);
  const iconoUrl = clima ? `./iconos/${clima.weather[0].icon}.svg` : "";

  const fetchClima = async (ciudad) => {
    try {
      const respuesta = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric`
      );
      const datos = await respuesta.json();
      setClima(datos);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const guardarHistorial = async (ciudad) => {
    try {
      await fetch("/api/historial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ciudad: ciudad }),
      });
      await fetchHistorialReciente();
    } catch (error) {
      console.error("Error al guardar historial:", error);
    }
  };

  const fetchHistorialReciente = async () => {
    try {
      const respuesta = await fetch("/api/historial");
      const data = await respuesta.json();
      setHistorial(data.map((search) => search.ciudad));
    } catch (error) {
      console.error("Error fetching recent searches:", error);
    }
  };

  useEffect(() => {
    fetchClima(ciudadSelec);
    fetchHistorialReciente();
  }, []);

  const ciudadesClick = async (ciudad) => {
    setCiudadSelec(ciudad);
    await fetchClima(ciudad);
    guardarHistorial(ciudad);
  };

  const cambioBuscar = (evento) => {
    setBuscarInput(evento.target.value);
  };

  const manejarBuscar = async () => {
    setCiudadSelec(buscarInput);
    await fetchClima(buscarInput);
    guardarHistorial(buscarInput);
    setBuscarInput("");
  };

  const apretarEnter = (evento) => {
    if (evento.key === "Enter") {
      manejarBuscar();
    }
  };

  return (
    <>
      <div className="principal">
        <nav>
          <ul>
            <li>
              <strong className="titulo">Clima</strong>
            </li>
          </ul>
          <ul className="ciudades">
            <li>
              <a
                href="#"
                className="ciudad"
                onClick={() => ciudadesClick("Tucuman")}
              >
                Tucuman
              </a>
            </li>
            <li>
              <a
                href="#"
                className="ciudad"
                onClick={() => ciudadesClick("Salta")}
              >
                Salta
              </a>
            </li>
            <li>
              <a
                href="#"
                className="ciudad"
                onClick={() => ciudadesClick("Buenos Aires")}
              >
                Buenos Aires
              </a>
            </li>
          </ul>
        </nav>

        <input
          className="buscar"
          type="search"
          placeholder="Buscar"
          aria-label="Buscar"
          value={buscarInput}
          onChange={cambioBuscar}
          onKeyDown={apretarEnter}
        />

        <main>
          {ciudadSelec && clima && (
            <>
              <article className="contenedor">
                <header>
                  <h2>{ciudadSelec}</h2>
                </header>
                <div className="iconos">
                  <img src={iconoUrl} alt="Clima Icono" />
                </div>
                <footer>
                  <h2>Temperatura: {clima.main.temp}C°</h2>
                  <p>
                    Minima: {clima.main.temp_min}C°/ Maxima:{" "}
                    {clima.main.temp_max}
                    C°
                  </p>
                  <p>Humedad: {clima.main.humidity}%</p>
                </footer>
              </article>
            </>
          )}
        </main>
      </div>

      <div className="historial">
        <h2>Recientes</h2>
        <div className="lugares_recientes">
          {historial.map((ciudad) => (
            <a
              href="#"
              className="ciudad"
              onClick={() => ciudadesClick(ciudad)}
            >
              <p>|{ciudad}|</p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
