export interface Dictionary {
  landing: {
    hero: {
      title: string;
      description: string;
      getStarted: string;
      learnMore: string;
      localSkills: string;
      trustedNeighbors: string;
    };
    faq: {
      title: string;
      items: { question: string; answer: string }[];
    };
    valueProps: {
      title: string;
      subtitle: string;
      features: {
        location: { title: string; description: string };
        skill: { title: string; description: string };
        earnings: { title: string; description: string };
      };
    };
    howItWorks: {
      title: string;
      subtitle: string;
      getStarted: string;
      steps: {
        profile: { title: string; description: string };
        browse: { title: string; description: string };
        complete: { title: string; description: string };
      };
      start: string;
    };
    footer: {
      brand: { title: string; description1: string; description2: string };
      jobSeekers: {
        title: string;
        links: {
          browseJobs: string;
          advancedSearch: string;
          nearbyJobs: string;
          jobRecommendation: string;
          skillsShowcase: string;
          viewOnMap: string;
          directConnection: string;
        };
      };
      jobProviders: {
        title: string;
        links: {
          postJob: string;
          advancedSearch: string;
          viewOnMap: string;
          rateReview: string;
          directConnection: string;
        };
      };
      connect: {
        title: string;
        socials: { twitter: string; linkedin: string; facebook: string; instagram: string };
      };
      copyright: string;
    };
  };
}
