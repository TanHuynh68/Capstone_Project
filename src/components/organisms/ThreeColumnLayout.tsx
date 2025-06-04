import React from "react";
import { Label } from "@/components/ui/label";

interface ImageDescription {
  imageUrl: string;
  description: string;
}

interface ThreeColumnLayoutProps {
  experience: {
    years: number;
    content: string;
    expertise: string[];
  };
  sectionOne: ImageDescription[];
  sectionTwo: ImageDescription[];
}

export const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({
  experience,
  sectionOne,
  sectionTwo,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Experience */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-2xl font-bold mb-4">Experience</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">Years of Experience</h4>
                <p className="text-gray-600">{experience.years} years</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Content</h4>
                <p className="text-gray-600">{experience.content}</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Expert In</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {experience.expertise.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Section One */}
        <div className="space-y-6">
          <Label className="text-xl font-bold block mb-4">Section One</Label>
          <div className="space-y-8">
            {sectionOne.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                <img
                  src={item.imageUrl}
                  alt={`Section One Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Section Two */}
        <div className="space-y-6">
          <Label className="text-xl font-bold block mb-4">Section Two</Label>
          <div className="space-y-8">
            {sectionTwo.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                <img
                  src={item.imageUrl}
                  alt={`Section Two Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
