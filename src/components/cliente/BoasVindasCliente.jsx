import { useNavigate } from "react-router-dom";

export default function BoasVindasCliente() {
  const navigate = useNavigate();

  const continuar = () => {
    navigate("/cadastro-cliente");
  };

  return (
    <div className="max-w-lg mx-auto mt-6 md:mt-10 p-4 md:p-6 border rounded shadow bg-white">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-700 text-center">
        Seja muito bem-vindo(a)!
      </h2>
      <p className="mb-6 text-center md:text-justify text-gray-700 text-sm md:text-base leading-relaxed">
        Estamos felizes em ter você por aqui. 😊
        <br />
        Nesta próxima etapa, você preencherá seus dados pessoais para que possamos
        oferecer um atendimento personalizado e seguro.
        <br /><br />
        Fique tranquilo: todas as informações são confidenciais e tratadas com
        segurança.
      </p>
      <div className="flex justify-center">
        <button
          onClick={continuar}
          className="w-full md:w-auto bg-green-600 text-white px-4 md:px-6 py-3 md:py-2 rounded hover:bg-green-700 transition-colors duration-200 text-base md:text-sm font-medium"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
