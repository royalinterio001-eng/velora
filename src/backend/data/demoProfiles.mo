import Types "../types/core";

// 50 demo profiles with realistic Indian names, bios, interests, and Unsplash photos.
// 30 women (indices 0-29), 20 men (indices 30-49).
module {
  public let profiles : [Types.DemoProfileData] = [
    // ── Women (30) ───────────────────────────────────────────────────────────
    {
      demoKey = "demo-1";
      name = "Priya Sharma";
      age = 26;
      bio = "Lover of chai, sunsets, and spontaneous road trips. I'm a graphic designer who believes life is too short for bad coffee. Looking for someone to explore hidden gems in the city with!";
      gender = #female;
      interests = ["Art", "Travel", "Coffee", "Photography"];
      location = "Mumbai";
      photoUrls = [
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
      ];
      isPremium = true;
    },
    {
      demoKey = "demo-2";
      name = "Anjali Patel";
      age = 24;
      bio = "Yoga instructor by day, Bollywood enthusiast by night. I find joy in small moments — a perfect sunrise, a good book, a hearty laugh. Let's create some beautiful memories together.";
      gender = #female;
      interests = ["Yoga", "Bollywood", "Reading", "Meditation"];
      location = "Ahmedabad";
      photoUrls = [
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80",
        "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-3";
      name = "Kavya Reddy";
      age = 28;
      bio = "Software engineer with a passion for hiking and home cooking. I make the best biryani south of the Vindhyas (my mom agrees). Looking for someone to share adventures and good food with.";
      gender = #female;
      interests = ["Hiking", "Cooking", "Tech", "Fitness"];
      location = "Hyderabad";
      photoUrls = [
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-4";
      name = "Deepika Iyer";
      age = 27;
      bio = "Classical Bharatanatyam dancer and finance professional — yes, both! I love the balance of art and logic in life. Weekends are for dance rehearsals and discovering new cafes.";
      gender = #female;
      interests = ["Dance", "Music", "Coffee", "Art"];
      location = "Chennai";
      photoUrls = [
        "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
      ];
      isPremium = true;
    },
    {
      demoKey = "demo-5";
      name = "Shreya Gupta";
      age = 25;
      bio = "Travel blogger who's been to 18 states and counting! Photography is how I see the world. I'm looking for a partner in crime who doesn't mind a last-minute flight booking.";
      gender = #female;
      interests = ["Travel", "Photography", "Foodie", "Fashion"];
      location = "Delhi";
      photoUrls = [
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=800&q=80",
        "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-6";
      name = "Meera Nair";
      age = 29;
      bio = "Doctor by profession, poet by heart. I write verses about monsoons, mangoes, and missing people. Life is a beautiful mess and I'm here for all of it.";
      gender = #female;
      interests = ["Poetry", "Reading", "Meditation", "Music"];
      location = "Kochi";
      photoUrls = [
        "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=800&q=80",
        "https://images.unsplash.com/photo-1491349174775-aaaefdd81942?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-7";
      name = "Pooja Singh";
      age = 23;
      bio = "Final year MBA student who loves cricket almost as much as strategy. I'm competitive, curious, and always up for a good debate. Swipe right if you can handle some friendly banter!";
      gender = #female;
      interests = ["Cricket", "Reading", "Fitness", "Coffee"];
      location = "Pune";
      photoUrls = [
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80",
        "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-8";
      name = "Nisha Mehta";
      age = 31;
      bio = "Interior designer who transforms spaces and hearts. I love antique markets, strong filter coffee, and long conversations that go past midnight. Let's build something beautiful together.";
      gender = #female;
      interests = ["Art", "Coffee", "Travel", "Cooking"];
      location = "Bangalore";
      photoUrls = [
        "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=800&q=80",
        "https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=800&q=80",
      ];
      isPremium = true;
    },
    {
      demoKey = "demo-9";
      name = "Riya Verma";
      age = 22;
      bio = "Aspiring chef who experiments with fusion recipes every Sunday. Food is love, and I want someone who agrees wholeheartedly. Fair warning: I will judge your chai preferences.";
      gender = #female;
      interests = ["Cooking", "Foodie", "Music", "Movies"];
      location = "Jaipur";
      photoUrls = [
        "https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&q=80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-10";
      name = "Ananya Joshi";
      age = 30;
      bio = "Startup founder, fitness fanatic, and avid reader. I believe in working hard and laughing harder. Looking for someone grounded, ambitious, and kind — in that order.";
      gender = #female;
      interests = ["Fitness", "Reading", "Tech", "Travel"];
      location = "Bangalore";
      photoUrls = [
        "https://images.unsplash.com/photo-1483181957632-8bda974cbc91?w=800&q=80",
        "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=800&q=80",
      ];
      isPremium = true;
    },
    {
      demoKey = "demo-11";
      name = "Divya Chauhan";
      age = 26;
      bio = "Kathak dancer and marketing professional. I have two left feet off the stage (kidding). I adore monsoon evenings, old Kishore Kumar songs, and people who smile with their eyes.";
      gender = #female;
      interests = ["Dance", "Music", "Bollywood", "Art"];
      location = "Lucknow";
      photoUrls = [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-12";
      name = "Swati Mishra";
      age = 28;
      bio = "Environmental researcher passionate about sustainability and clean rivers. When I'm not saving the world, I'm hiking or trying to perfect my dosa recipe. A good soul is non-negotiable.";
      gender = #female;
      interests = ["Hiking", "Cooking", "Meditation", "Travel"];
      location = "Bhopal";
      photoUrls = [
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-13";
      name = "Sunita Yadav";
      age = 27;
      bio = "Teacher who believes every child is a superstar. I collect books, pressed flowers, and interesting people. Life is short — eat the dessert first and always say yes to adventures.";
      gender = #female;
      interests = ["Reading", "Poetry", "Cooking", "Yoga"];
      location = "Varanasi";
      photoUrls = [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
        "https://images.unsplash.com/photo-1546961342-ea5f60b193cb?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-14";
      name = "Rani Pandey";
      age = 24;
      bio = "Journalist chasing stories and sunsets. I ask too many questions — it's a professional habit. I love Kolkata's chaos, mishti doi, and people who are unapologetically themselves.";
      gender = #female;
      interests = ["Travel", "Photography", "Reading", "Foodie"];
      location = "Kolkata";
      photoUrls = [
        "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=800&q=80",
        "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-15";
      name = "Geeta Kumar";
      age = 32;
      bio = "Architect who designs green spaces and nurtures relationships with equal care. I love long drives, instrumental music, and cooking elaborate Sunday lunches. Family-oriented and proud of it.";
      gender = #female;
      interests = ["Art", "Music", "Cooking", "Fitness"];
      location = "Chandigarh";
      photoUrls = [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
        "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=800&q=80",
      ];
      isPremium = true;
    },
    {
      demoKey = "demo-16";
      name = "Lakshmi Nair";
      age = 25;
      bio = "Marine biologist who talks to fish (they listen). Goa's beaches are my second home. I'm looking for someone who appreciates the ocean, impromptu coconut water breaks, and honest conversations.";
      gender = #female;
      interests = ["Travel", "Fitness", "Photography", "Coffee"];
      location = "Goa";
      photoUrls = [
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80",
        "https://images.unsplash.com/photo-1524502397800-2ece0a8a1a04?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-17";
      name = "Radha Iyer";
      age = 29;
      bio = "Carnatic music vocalist and software consultant — a rare combination, I know! Music is my meditation. I'm looking for someone who can appreciate both code and ragas.";
      gender = #female;
      interests = ["Music", "Meditation", "Tech", "Dance"];
      location = "Bangalore";
      photoUrls = [
        "https://images.unsplash.com/photo-1509460913899-515f1df34fea?w=800&q=80",
        "https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-18";
      name = "Sita Sharma";
      age = 26;
      bio = "Nutritionist who eats her veggies and occasionally her feelings (in the form of dark chocolate). I run half-marathons and believe in balance — 5K before brunch.";
      gender = #female;
      interests = ["Fitness", "Cooking", "Yoga", "Hiking"];
      location = "Delhi";
      photoUrls = [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-19";
      name = "Durga Reddy";
      age = 34;
      bio = "Senior product manager who ships features and bakes bread with equal dedication. I'm a calm presence in a chaotic world. Looking for depth, warmth, and someone who laughs at my terrible puns.";
      gender = #female;
      interests = ["Tech", "Cooking", "Reading", "Travel"];
      location = "Hyderabad";
      photoUrls = [
        "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&q=80",
        "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&q=80",
      ];
      isPremium = true;
    },
    {
      demoKey = "demo-20";
      name = "Parvati Joshi";
      age = 23;
      bio = "Art student turning blank canvases into emotions. I find beauty in everything — peeling walls, rusty chai-wallahs, and imperfect people. Looking for a muse who's also looking for theirs.";
      gender = #female;
      interests = ["Art", "Photography", "Music", "Poetry"];
      location = "Mumbai";
      photoUrls = [
        "https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=800&q=80",
        "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-21";
      name = "Kiran Mehta";
      age = 27;
      bio = "Fashion designer who sketches dreams and sews them into reality. Street food is my weakness and Rajasthani folk music is my soul. A compassionate heart matters more than a perfect bio.";
      gender = #female;
      interests = ["Fashion", "Art", "Music", "Foodie"];
      location = "Jaipur";
      photoUrls = [
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
        "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-22";
      name = "Preethi Verma";
      age = 30;
      bio = "Child psychologist who loves understanding people as much as helping them. Board games on rainy evenings, road trips to hill stations, and endless conversations over hot soup — that's my kind of weekend.";
      gender = #female;
      interests = ["Reading", "Travel", "Coffee", "Movies"];
      location = "Pune";
      photoUrls = [
        "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&q=80",
        "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-23";
      name = "Tanvi Gupta";
      age = 25;
      bio = "Data scientist who turns numbers into stories. I love trail running, amateur astronomy, and competitive cooking shows. If you know what p-value means or want to learn — let's talk!";
      gender = #female;
      interests = ["Tech", "Fitness", "Reading", "Gaming"];
      location = "Bangalore";
      photoUrls = [
        "https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=800&q=80",
        "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-24";
      name = "Simran Singh";
      age = 28;
      bio = "Classical tabla player and HR professional — I keep the beat in meetings too. Amritsar is home but the whole world is my playground. Seeking someone who matches my energy and doesn't take life too seriously.";
      gender = #female;
      interests = ["Music", "Travel", "Dance", "Yoga"];
      location = "Amritsar";
      photoUrls = [
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=800&q=80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80",
      ];
      isPremium = true;
    },
    {
      demoKey = "demo-25";
      name = "Neha Chauhan";
      age = 22;
      bio = "Computer science student and part-time barista. I brew coffee and debug code — both require patience and precision. Looking for someone who's as passionate about their craft as I am about mine.";
      gender = #female;
      interests = ["Tech", "Coffee", "Gaming", "Music"];
      location = "Indore";
      photoUrls = [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
        "https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-26";
      name = "Pallavi Pandey";
      age = 33;
      bio = "Oncologist who fights cancer by day and grows tomatoes on my balcony by night. Life's brevity makes me cherish every good moment. Seeking a genuine, loving connection.";
      gender = #female;
      interests = ["Cooking", "Yoga", "Meditation", "Reading"];
      location = "Chennai";
      photoUrls = [
        "https://images.unsplash.com/photo-1491349174775-aaaefdd81942?w=800&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-27";
      name = "Ritika Nair";
      age = 24;
      bio = "Travel photographer who captures moments that words can't describe. Currently based in Kochi but my heart is in the mountains. Let's go somewhere we've never been.";
      gender = #female;
      interests = ["Photography", "Hiking", "Travel", "Art"];
      location = "Kochi";
      photoUrls = [
        "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=800&q=80",
        "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-28";
      name = "Aishwarya Reddy";
      age = 31;
      bio = "Management consultant who loves weekend escapes to the countryside. I read three books a month, run 5k twice a week, and make excellent filter coffee. Looking for a partner, not just a date.";
      gender = #female;
      interests = ["Reading", "Fitness", "Coffee", "Travel"];
      location = "Hyderabad";
      photoUrls = [
        "https://images.unsplash.com/photo-1483181957632-8bda974cbc91?w=800&q=80",
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      ];
      isPremium = true;
    },
    {
      demoKey = "demo-29";
      name = "Rekha Sharma";
      age = 26;
      bio = "Flautist and school music teacher. I find the sweetest melodies in everyday life — rain on windows, children's laughter, the first sip of chai. Come make music with me, metaphorically speaking.";
      gender = #female;
      interests = ["Music", "Poetry", "Yoga", "Cooking"];
      location = "Bhopal";
      photoUrls = [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
        "https://images.unsplash.com/photo-1524502397800-2ece0a8a1a04?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-30";
      name = "Shreya Mishra";
      age = 29;
      bio = "UX designer obsessed with making things beautiful and usable. I believe great design, like great love, should be invisible yet essential. Seeking someone who notices the small things.";
      gender = #female;
      interests = ["Art", "Tech", "Coffee", "Hiking"];
      location = "Mumbai";
      photoUrls = [
        "https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=800&q=80",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
      ];
      isPremium = false;
    },
    // ── Men (20) ─────────────────────────────────────────────────────────────
    {
      demoKey = "demo-31";
      name = "Rahul Sharma";
      age = 28;
      bio = "Civil engineer building bridges, literally and figuratively. I'm a cricket fanatic, amateur chef, and terrible dancer (but enthusiastic). Life's too short to be boring — let's grab a coffee and find out.";
      gender = #male;
      interests = ["Cricket", "Cooking", "Travel", "Fitness"];
      location = "Delhi";
      photoUrls = [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-32";
      name = "Arjun Patel";
      age = 30;
      bio = "Entrepreneur building a sustainable fashion startup. I run 10k every morning, read obsessively, and believe kindness is underrated. Looking for a partner who's curious about the world.";
      gender = #male;
      interests = ["Fitness", "Reading", "Fashion", "Tech"];
      location = "Ahmedabad";
      photoUrls = [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
      ];
      isPremium = true;
    },
    {
      demoKey = "demo-33";
      name = "Vikram Singh";
      age = 32;
      bio = "Fighter pilot turned tech founder. I approach both flying and coding the same way — precise, calm, and always looking for the horizon. I make exceptional chai and terrible small talk.";
      gender = #male;
      interests = ["Tech", "Fitness", "Travel", "Coffee"];
      location = "Bangalore";
      photoUrls = [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80",
        "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=800&q=80",
      ];
      isPremium = true;
    },
    {
      demoKey = "demo-34";
      name = "Rohit Gupta";
      age = 25;
      bio = "Graphic novelist who spends evenings drawing cityscapes and imagining other worlds. Bollywood movies, street food, and rooftop conversations are my happy place. I'm looking for my co-author in life.";
      gender = #male;
      interests = ["Art", "Bollywood", "Foodie", "Photography"];
      location = "Mumbai";
      photoUrls = [
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-35";
      name = "Amit Kumar";
      age = 27;
      bio = "Yoga instructor and wellness coach who practices what he preaches. Mornings at the ghats, evenings with a good book, and weekends exploring temples and forests. Seeking a soulful connection.";
      gender = #male;
      interests = ["Yoga", "Meditation", "Travel", "Reading"];
      location = "Varanasi";
      photoUrls = [
        "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&q=80",
        "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-36";
      name = "Suresh Reddy";
      age = 29;
      bio = "Cardiologist who takes heart health (and good relationships) very seriously. I love old Telugu movies, long drives through Andhra villages, and cooking my grandmother's recipes. Genuine and simple.";
      gender = #male;
      interests = ["Cooking", "Movies", "Fitness", "Music"];
      location = "Hyderabad";
      photoUrls = [
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80",
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-37";
      name = "Raj Iyer";
      age = 33;
      bio = "Startup CTO who codes, mentors, and plays jazz guitar on weekends. Chennai filter coffee is non-negotiable. I'm looking for someone smart, independent, and not afraid of deep conversations at 2 AM.";
      gender = #male;
      interests = ["Tech", "Music", "Coffee", "Travel"];
      location = "Chennai";
      photoUrls = [
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
        "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&q=80",
      ];
      isPremium = true;
    },
    {
      demoKey = "demo-38";
      name = "Dev Verma";
      age = 24;
      bio = "Architecture student inspired by the old haveli of Rajasthan. I sketch everything I see and dream in blueprints. Looking for someone who appreciates beauty in structures and people alike.";
      gender = #male;
      interests = ["Art", "Photography", "Travel", "Reading"];
      location = "Jaipur";
      photoUrls = [
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
        "https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-39";
      name = "Nikhil Joshi";
      age = 26;
      bio = "Mountaineer and software developer — I tackle peaks and production bugs with the same determination. Manali in summer, Pondicherry in winter, home for Diwali. Adventure and family — my two pillars.";
      gender = #male;
      interests = ["Hiking", "Tech", "Travel", "Fitness"];
      location = "Dehradun";
      photoUrls = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
        "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-40";
      name = "Sanjay Mehta";
      age = 31;
      bio = "Investment banker by week, home baker by weekend. I make sourdough from scratch and analyze P&L sheets with equal joy. Looking for someone to share a laugh, a loaf, and a long life with.";
      gender = #male;
      interests = ["Cooking", "Fitness", "Travel", "Coffee"];
      location = "Mumbai";
      photoUrls = [
        "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&q=80",
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&q=80",
      ];
      isPremium = true;
    },
    {
      demoKey = "demo-41";
      name = "Aditya Nair";
      age = 28;
      bio = "Marine photographer and conservation volunteer. The ocean is my office. I believe we protect what we love — I want to love and protect the right person too. Serious about life, fun about everything else.";
      gender = #male;
      interests = ["Photography", "Travel", "Fitness", "Meditation"];
      location = "Kochi";
      photoUrls = [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-42";
      name = "Vivek Chauhan";
      age = 27;
      bio = "High school physics teacher who moonlights as a stand-up comedian. My jokes are as reliable as thermodynamics. Seeking someone who appreciates both science puns and genuine warmth.";
      gender = #male;
      interests = ["Reading", "Music", "Cricket", "Movies"];
      location = "Pune";
      photoUrls = [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
        "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-43";
      name = "Manish Yadav";
      age = 34;
      bio = "Documentary filmmaker capturing untold stories from rural India. I've slept under Rajasthani skies, eaten daal baati by fires, and cried at sunrises. Looking for someone who values stories over status.";
      gender = #male;
      interests = ["Photography", "Travel", "Art", "Music"];
      location = "Jodhpur";
      photoUrls = [
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-44";
      name = "Ravi Pandey";
      age = 29;
      bio = "IIT alumnus working on clean energy solutions. Cricket Saturday mornings, philosophy book in the afternoon, and cooking experiments by evening — that's my weekend. Looking for something real.";
      gender = #male;
      interests = ["Tech", "Cricket", "Reading", "Cooking"];
      location = "Delhi";
      photoUrls = [
        "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&q=80",
        "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-45";
      name = "Sunil Sharma";
      age = 26;
      bio = "Professional cricketer playing domestic circuits. Training 6 days a week doesn't leave much time for apps, but here I am! I love Punjabi music, butter chicken, and honest people.";
      gender = #male;
      interests = ["Cricket", "Fitness", "Music", "Foodie"];
      location = "Ludhiana";
      photoUrls = [
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-46";
      name = "Vinod Patel";
      age = 30;
      bio = "Product manager at a fintech startup. I apply user-centered thinking to everything — including relationships. Weekends are for hiking the Aravalli range and discovering hole-in-the-wall restaurants.";
      gender = #male;
      interests = ["Tech", "Hiking", "Foodie", "Reading"];
      location = "Ahmedabad";
      photoUrls = [
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&q=80",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
      ];
      isPremium = true;
    },
    {
      demoKey = "demo-47";
      name = "Naveen Kumar";
      age = 25;
      bio = "Game developer who crafts immersive worlds by day and games all night. I'm a gentle soul with a competitive spirit. Looking for a player two who's kind, creative, and loves mango ice cream.";
      gender = #male;
      interests = ["Gaming", "Tech", "Music", "Movies"];
      location = "Bangalore";
      photoUrls = [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
        "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-48";
      name = "Deepak Mishra";
      age = 32;
      bio = "Neuroscientist studying memory and consciousness. I find the brain as mysterious as the heart. Long walks in Nandi Hills, carnatic music playlists, and good Kerala food keep me grounded.";
      gender = #male;
      interests = ["Music", "Hiking", "Reading", "Meditation"];
      location = "Bangalore";
      photoUrls = [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-49";
      name = "Prasad Iyer";
      age = 28;
      bio = "Wedding photographer who has witnessed hundreds of love stories but is still writing his own. I believe in magic moments, genuine smiles, and slow Sunday mornings with good coffee and better company.";
      gender = #male;
      interests = ["Photography", "Coffee", "Travel", "Movies"];
      location = "Chennai";
      photoUrls = [
        "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&q=80",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
      ];
      isPremium = false;
    },
    {
      demoKey = "demo-50";
      name = "Karan Singh";
      age = 27;
      bio = "Army officer who just returned from a posting in Ladakh — the mountains changed me. I love poetry, old Bollywood, and simple people with big hearts. Looking for something deep and lasting.";
      gender = #male;
      interests = ["Poetry", "Travel", "Fitness", "Music"];
      location = "Jaipur";
      photoUrls = [
        "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&q=80",
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80",
      ];
      isPremium = true;
    },
  ];
};
