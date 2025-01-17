import React from "react";
import Papa from "papaparse";
import { Users, Share2 } from "lucide-react";
import * as _ from "lodash";

const TennisGroupGenerator = () => {
  const [groups, setGroups] = React.useState([]);
  const [error, setError] = React.useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const groupedPlayers = _.groupBy(results.data, "grupo");
            const groupsArray = Object.values(groupedPlayers);
            setGroups(groupsArray);
            setError("");
          }
        },
        error: (error) => {
          setError("Error al procesar el archivo: " + error.message);
        },
      });
    }
  };

  const createWhatsAppLink = (players, groupNumber) => {
    const groupName = `Grupo Tenis ${groupNumber}`;
    return `https://wa.me/send?text=Hola! Los invito al grupo de tenis "${groupName}". Por favor, únanse usando este enlace.%0A%0AParticipantes:%0A${players
      .map((p) => `- ${p.nombre}: ${p.telefono}`)
      .join("%0A")}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold">
            Generador de Grupos de WhatsApp
          </h1>
        </div>

        {/* Texto explicativo */}
        <div className="space-y-4 text-gray-600 mb-8">
          <p>
            Bienvenido a la herramienta oficial de creación de grupos de
            WhatsApp para la Liga Amunt i Avall del Club Barcino. Esta
            aplicación está diseñada exclusivamente para el uso del personal de
            Tenis del Club.
          </p>
          <p>
            <strong>Cómo funciona:</strong>
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Prepare un archivo Excel y guárdelo como CSV con las siguientes
              columnas:
              <ul className="list-disc pl-5 mt-1">
                <li>
                  <strong>nombre:</strong> Nombre completo del jugador
                </li>
                <li>
                  <strong>telefono:</strong> Número de teléfono (preferiblemente
                  en formato internacional, ej: 34612345678)
                </li>
                <li>
                  <strong>grupo:</strong> Número o nombre del grupo al que
                  pertenece
                </li>
              </ul>
            </li>
            <li>
              Puede incluir tantos jugadores como desee en cada grupo, no hay
              límite de participantes.
            </li>
            <li>
              Al subir el archivo, se generarán automáticamente los enlaces para
              crear los grupos de WhatsApp.
            </li>
          </ol>
        </div>

        {/* Selector de archivo */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Subir archivo CSV (con columnas &apos;nombre&apos;, &apos;telefono&apos; y &apos;grupo&apos;)
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />
        </div>
      </div>

      {/* Mensaje de error */}
      {error && <div className="text-red-600 mb-6">{error}</div>}

      {/* Lista de grupos */}
      {groups.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Grupos Existentes</h2>
          <div className="space-y-4">
            {groups.map((group, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium mb-3">Grupo {group[0].grupo}</h3>
                    <ul className="space-y-1 text-gray-600">
                      {group.map((player, playerIndex) => (
                        <li key={playerIndex}>
                          {player.nombre} - {player.telefono}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={createWhatsAppLink(group, group[0].grupo)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Crear Grupo</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TennisGroupGenerator;
