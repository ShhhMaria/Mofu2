import React from 'react';
import { PawPrint, MapPin, AlertCircle, Droplet, Zap, Utensils } from 'lucide-react';

export default function Home() {
  const careTips = [
    {
      id: 1,
      title: 'Regular Vet Checkups',
      description:
        'Schedule annual or bi-annual vet visits to catch health issues early and keep vaccinations up to date.',
      icon: PawPrint, // changed from Heart to PawPrint
      color: 'bg-red-100 text-red-600',
    },
    {
      id: 2,
      title: 'Balanced Diet',
      description:
        "Feed your pet high-quality, age-appropriate food. Consult your vet about the best nutrition for your pet's needs.",
      icon: Utensils,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      id: 3,
      title: 'Daily Exercise',
      description:
        'Ensure your pet gets enough physical activity daily. Exercise helps maintain a healthy weight and mental stimulation.',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      id: 4,
      title: 'Hydration',
      description:
        'Always provide fresh, clean water for your pet throughout the day. Proper hydration is crucial for health.',
      icon: Droplet,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 5,
      title: 'Grooming & Hygiene',
      description:
        'Regular grooming, nail trimming, and tooth brushing help prevent infections and keep your pet looking great.',
      icon: AlertCircle,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 6,
      title: 'Mental Stimulation',
      description:
        'Provide toys, games, and interactive activities to keep your pet mentally engaged and prevent boredom.',
      icon: Zap,
      color: 'bg-green-100 text-green-600',
    },
  ];

  const vetClinics = [
    {
      id: 1,
      name: 'Bohol Veterinary Medical Society Clinic',
      address: 'Tawala St, Tagbilaran City, 6300',
      phone: '(038) 411-2345',
      hours: 'Mon-Fri: 8AM-5PM, Sat: 8AM-12PM',
      services: ['General Practice', 'Vaccination', 'Surgery', 'Dental Care'],
    },
    {
      id: 2,
      name: 'Pet Care Veterinary Clinic',
      address: 'Garcia St, Tagbilaran City, 6300',
      phone: '(038) 502-1234',
      hours: 'Mon-Sat: 8AM-6PM, Sun: 10AM-2PM',
      services: ['General Practice', 'Grooming', 'Boarding', 'Pet Hotel'],
    },
    {
      id: 3,
      name: 'Dr. Santos Veterinary Clinic',
      address: 'CPG Ave, Tagbilaran City, 6300',
      phone: '(038) 411-5678',
      hours: 'Mon-Fri: 9AM-5PM, Sat: 9AM-1PM',
      services: ['General Practice', 'Microchipping', 'Spaying/Neutering', 'Vaccination'],
    },
    {
      id: 4,
      name: 'Happy Pets Veterinary Center',
      address: 'Rizal Ave, Tagbilaran City, 6300',
      phone: '(038) 501-9876',
      hours: 'Daily: 8AM-7PM',
      services: ['Emergency Care', 'Surgery', 'Ultrasound', 'Laboratory Services'],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold text-amber-900">Welcome to Mofu2</h1>
        <p className="text-lg text-amber-700">
          Your complete pet care companion. Track, plan, and care for your beloved pets with ease.
        </p>
      </div>

      {/* Pet Care Tips Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <PawPrint className="w-8 h-8 text-amber-700" /> {/* header icon changed */}
          <h2 className="text-3xl font-bold text-amber-900">Essential Pet Care Tips</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careTips.map((tip) => {
            const Icon = tip.icon;
            return (
              <div
                key={tip.id}
                className="bg-white rounded-lg border border-orange-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${tip.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-amber-900 mb-2">{tip.title}</h3>
                    <p className="text-sm text-amber-700">{tip.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Veterinary Clinics Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <MapPin className="w-8 h-8 text-amber-700" />
          <h2 className="text-3xl font-bold text-amber-900">Nearby Veterinary Clinics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vetClinics.map((clinic) => (
            <div
              key={clinic.id}
              className="bg-white rounded-lg border border-orange-200 p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-amber-900 mb-3">{clinic.name}</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-700">Address</p>
                    <p className="text-amber-900">{clinic.address}</p>
                  </div>
                </div>

                <div className="border-t border-orange-200 pt-3">
                  <p className="text-sm font-medium text-amber-700 mb-1">Phone</p>
                  <a
                    href={`tel:${clinic.phone}`}
                    className="text-amber-900 hover:text-amber-700 font-medium"
                  >
                    {clinic.phone}
                  </a>
                </div>

                <div className="border-t border-orange-200 pt-3">
                  <p className="text-sm font-medium text-amber-700 mb-1">Hours</p>
                  <p className="text-sm text-amber-900">{clinic.hours}</p>
                </div>

                <div className="border-t border-orange-200 pt-3">
                  <p className="text-sm font-medium text-amber-700 mb-2">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {clinic.services.map((service) => (
                      <span
                        key={service}
                        className="px-3 py-1 bg-orange-50 text-amber-700 text-xs font-medium rounded-full border border-orange-200"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-orange-200 p-8 text-center">
        <h2 className="text-2xl font-bold text-amber-900 mb-3">Ready to Care for Your Pet?</h2>
        <p className="text-amber-700 mb-6">Head to your Dashboard to manage your pets and create care schedules.</p>
      </section>
    </div>
  );
}