import { Head } from "@inertiajs/react";
import VirtualCampusLayout from "../../../layouts/VirtualCampusLayout";
import VirtualHeroSection from "../../../components/sections/virtual/VirtualHeroSection";
import VirtualAcademicProgramsSection from "../../../components/sections/virtual/VirtualAcademicProgramsSection";
import VirtualHomepageStorySections from "../../../components/sections/virtual/VirtualHomepageStorySections";

export default function Virtual({ programs = [], categories = [] }) {
  return (
    <VirtualCampusLayout homepage>
      <Head title="Virtual Campus - AIRADS College" />
      
      <VirtualHeroSection categories={categories} />
      
      <VirtualAcademicProgramsSection programs={programs} categories={categories} />

      <VirtualHomepageStorySections programs={programs} />
      
    </VirtualCampusLayout>
  );
}
