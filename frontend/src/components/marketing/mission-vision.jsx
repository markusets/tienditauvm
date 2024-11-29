import { Card, CardHeader, CardContent } from "@/components/ui/card";

function MissionVision() {
  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
        {/* Misión */}
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-800">Nuestra Misión</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Nuestra misión es ofrecer productos de alta calidad que cumplan con
              las expectativas de nuestros clientes, promoviendo siempre la
              innovación y la responsabilidad social.
            </p>
          </CardContent>
        </Card>

        {/* Visión */}
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-800">Nuestra Visión</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Aspiramos a ser una empresa líder en el mercado, reconocida por
              nuestra dedicación a la excelencia y nuestro compromiso con el
              desarrollo sostenible.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MissionVision;

