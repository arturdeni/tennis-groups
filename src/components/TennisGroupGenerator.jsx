import React from "react";
import Papa from "papaparse";
import { Users, Copy, Check } from "lucide-react";
import * as _ from "lodash";

const TennisGroupGenerator = () => {
  const [groups, setGroups] = React.useState([]);
  const [error, setError] = React.useState("");
  const [copiedGroup, setCopiedGroup] = React.useState(null);

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

  const copyNumbers = (players, groupNumber) => {
    // Copiar solo los números al portapapeles
    const numbers = players.map((p) => p.telefono).join(", ");
    navigator.clipboard.writeText(numbers);
    setCopiedGroup(groupNumber);
    setTimeout(() => setCopiedGroup(null), 2000);
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
              Al subir el archivo, se mostrarán los grupos y podrá copiar los
              números fácilmente para crear los grupos en WhatsApp.
            </li>
          </ol>
        </div>

        {/* Selector de archivo */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Subir archivo CSV (con columnas &apos;nombre&apos;,
            &apos;telefono&apos; y &apos;grupo&apos;)
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
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-blue-800 mb-2">
              Instrucciones para crear grupos:
            </h3>
            <ol className="list-decimal pl-4 text-blue-700 space-y-1">
              <li>
                Haz clic en &quot;Copiar Números&quot; para el grupo que desees crear
              </li>
              <li>Abre WhatsApp en tu teléfono</li>
              <li>Pulsa en los tres puntos → Nuevo grupo</li>
              <li>Pega los números copiados en el campo de búsqueda</li>
              <li>Selecciona los participantes y crea el grupo</li>
            </ol>
          </div>

          <h2 className="text-xl font-semibold">Grupos para Crear</h2>
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
                  <button
                    onClick={() => copyNumbers(group, group[0].grupo)}
                    className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    {copiedGroup === group[0].grupo ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copiar Números</span>
                      </>
                    )}
                  </button>
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
