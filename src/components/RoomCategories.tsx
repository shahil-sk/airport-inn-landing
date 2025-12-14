import { Crown, Sparkles, Star, Snowflake, Wind } from 'lucide-react';

const categories = [
  {
    name: 'Suite Room',
    icon: Crown,
    description: 'Ultimate luxury with premium amenities',
    color: 'from-gold to-gold-dark',
  },
  {
    name: 'Mini Suite',
    icon: Sparkles,
    description: 'Compact elegance for discerning guests',
    color: 'from-forest to-forest-dark',
  },
  {
    name: 'Junior Suite',
    icon: Star,
    description: 'Perfect blend of comfort and style',
    color: 'from-bark to-bark-light',
  },
  {
    name: 'Deluxe AC',
    icon: Snowflake,
    description: 'Cool comfort with modern amenities',
    color: 'from-primary to-forest-light',
  },
  {
    name: 'Deluxe Non-AC',
    icon: Wind,
    description: 'Natural ventilation with cozy charm',
    color: 'from-gold-dark to-bark',
  },
];

const RoomCategories = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Accommodation Types
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your Perfect Stay
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From luxurious suites to comfortable deluxe rooms, we have the perfect accommodation for every traveler
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <a
              key={category.name}
              href="#rooms"
              className="group relative bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {category.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomCategories;
