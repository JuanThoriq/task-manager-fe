"use client";

import { motion } from "framer-motion";
import { Users, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export default function TeamPage() {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Juan Thoriq Pahlevi",
      role: "Full Stack Developer",
      bio: "Passionate about creating intuitive user experiences and scalable applications.",
      avatar: "/placeholder.svg?height=400&width=400",
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
        email: "juan@example.com",
      },
    },
    {
      id: 2,
      name: "Nelsen",
      role: "Full Stack Developer",
      bio: "Focused on creating beautiful interfaces that balance form and function.",
      avatar: "/placeholder.svg?height=400&width=400",
      social: {
        github: "#",
        linkedin: "#",
        twitter: "#",
        email: "nelsen@example.com",
      },
    },
  ];

  return (
    <div className="p-6 pt-20 md:pt-24 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-12 text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent mb-4">
          Our Team
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Meet the talented individuals behind our success. Our small but mighty
          team is dedicated to delivering exceptional results.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 bg-gradient-to-br from-violet-500/20 to-indigo-500/20">
                <div className="aspect-square relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.3 }}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-4xl md:text-5xl font-bold"
                    >
                      {member.name.charAt(0)}
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {member.name}
                  </h2>
                  <p className="text-violet-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 mb-6">{member.bio}</p>
                </div>

                <div className="flex space-x-2">
                  {member.social.github && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-9 w-9 border-gray-200 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200"
                    >
                      <Github className="h-4 w-4" />
                    </Button>
                  )}
                  {member.social.linkedin && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-9 w-9 border-gray-200 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  )}
                  {member.social.twitter && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-9 w-9 border-gray-200 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                  )}
                  {member.social.email && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-9 w-9 border-gray-200 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-violet-50 mb-6">
          <Users className="h-6 w-6 text-violet-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Join Our Team</h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-6">
          We're always looking for talented individuals to join our team. If
          you're passionate about what we do, we'd love to hear from you.
        </p>
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-6">
          View Open Positions
        </Button>
      </motion.div>
    </div>
  );
}
