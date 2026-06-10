import React from "react";
import { Head } from "@inertiajs/react";
import VirtualCampusLayout from "../../../layouts/VirtualCampusLayout";
import VirtualHeroSection from "../../../components/sections/virtual/VirtualHeroSection";
import VirtualShortCoursesSection from "../../../components/sections/virtual/VirtualShortCoursesSection";
import VirtualAcademicProgramsSection from "../../../components/sections/virtual/VirtualAcademicProgramsSection";

export default function Virtual({ programs = [] }) {
  return (
    <VirtualCampusLayout>
      <Head title="Virtual Campus - AIRADS College" />
      
      <VirtualHeroSection />
      
      <VirtualShortCoursesSection />
      
      <VirtualAcademicProgramsSection programs={programs} />
      
    </VirtualCampusLayout>
  );
}
