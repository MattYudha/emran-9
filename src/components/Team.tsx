import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import { Linkedin, Twitter, Mail } from "lucide-react";

interface TeamMemberProps {
  image: string;
  name: string;
  position: string;
  bio: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({
  image,
  name,
  position,
  bio,
}) => {
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-lg shadow-lg mb-4 transform transition duration-300 group-hover:scale-105">
        <img
          src={image}
          alt={name}
          className="w-full h-72 object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

        {/* Social icons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center space-x-3 translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
          <a
            href="#"
            className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-colors"
          >
            <Linkedin className="h-5 w-5 text-white" />
          </a>
          <a
            href="#"
            className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-colors"
          >
            <Twitter className="h-5 w-5 text-white" />
          </a>
          <a
            href="#"
            className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-colors"
          >
            <Mail className="h-5 w-5 text-white" />
          </a>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        {name}
      </h3>
      <p className="text-green-600 dark:text-green-400 mb-2">{position}</p>
      <p className="text-gray-600 dark:text-gray-300">{bio}</p>
    </div>
  );
};

const Team: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const teamMembers = [
    {
      image: "assets/UPCC.png",
      name: "UPC LABEL",
      position: t.founderCEO,
      bio: t.founderBio,
    },
    {
      image: "assets/label.png",
      name: "Size LABEL",
      position: t.designDirector,
      bio: t.designDirectorBio,
    },
    {
      image: "assets/Hangtag.png",
      name: "HANGTAG DESIGN LAYOUT",
      position: t.productionManager,
      bio: t.productionManagerBio,
    },
    {
      image: "assets/Stickerr.png",
      name: "STICKER DESIGN",
      position: t.salesDirector,
      bio: t.salesDirectorBio,
    },
  ];

  return (
    <section id="team" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.ourTeam}
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
            {t.teamSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember
              key={index}
              image={member.image}
              name={member.name}
              position={member.position}
              bio={member.bio}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
