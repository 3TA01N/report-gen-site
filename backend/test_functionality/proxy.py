#used to run actions like creating knowledge bases for testing
from knowledgebase import KnowledgeBase
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

recursive_chunker = RecursiveCharacterTextSplitter(
                                chunk_size=200,
                                chunk_overlap=20,
                                length_function=len,
                                is_separator_regex=False,
                            )
embedder = HuggingFaceEmbeddings()
bio_kb = KnowledgeBase(vector_store_location = "./biologist", embedder_name="")
clim_kb = KnowledgeBase(vector_store_location = "./climate", embedder_name="")

text_bio = """
Biology is the study of life. As humans are living things, we have a natural sense of curiosity and affection towards life and how has come to be.

The study of biology incorporates everything imaginable related to the life on Earth. It can be very broad and focus on details regarding the entire planet or it may be very specific and study microscopic structures such as bacteria or DNA.

Studying living things, called organisms, takes us all around the world, from the most productive tropical rain forests to the hostile lands of Antarctica or the deepest oceanic basins.

Although our knowledge of the world around us is constantly changing, there are a few basic principles of biology that should hopefully remain useful for many years to come. Most biological study is built on the foundations of five universally recognized truths. These are:

Stick insectCells are the basic unit of life.
Genes are the basic units for passing traits from parent to offspring.
Evolution by natural selection is the process that has led to the great diversity of species on Earth.
Living things maintain the environment within their cells and bodies.
Living things have the ability to acquire and transform energy.
As you can imagine and may very well know, biology is a massive field of study. It is constantly developing as biologists around the world are completing research and taking our understanding of life to new levels.

Everyday new information is published in different fields of biology and it is near on impossible for one person to keep up-to-date with every topic related to biology. However, everyone has to start somewhere and studying biology can enlighten your understanding of the world around you.

Life
Life is a phenomenon existing (as far as we know) only on Earth. ‘Life’ is the title given to separate the things that are able to function by themselves from material objects such as rocks and water.

Sumatran tigerAll of the living things on Earth are collectively known as organisms. There are a range of functions that are essential for something to be considered an organism. These include movement, respiration, sensitivity, growth, reproduction, the release of wastes and the consumption of food.


Life has evolved into an incredible array of shapes and forms. Humans belong to the most advanced group of organisms, the animals. Other higher-level organisms include plants and fungi.

More primitive life forms include microscopic groups such as bacteria and archaea. Viruses are an unusual group because they are unable to reproduce without the use of a host cell. As such, viruses are classed by some biologists to be living and by others to be not.

Cells
All living things are built from microscopic structures called cells. One cell has the potential to sustain life and is the simplest structure capable of doing so.

Plant cellsAlthough life evolved into multi-cellular organisms a long time ago, the majority of life on Earth still remains as single-celled organisms. Bacteria, archaea, protists, and many fungi have only one cell and are able to survive and reproduce in a huge array of ways that puts plants and animals to shame.


Cells are typically divided into two main categories: prokaryotic cells and eukaryotic cells. Prokaryotic cells are found only in microscopic organisms such as bacteria and archaea. Eukaryotic cells are found in more advanced organisms such as animals, plants, and fungi.

The main difference between the two types of cells is that eukaryotic cells have a nucleus which contains the cell’s DNA and has specialized structures called organelles. Organelles perform specific functions such as photosynthesis and protein production. In prokaryotic cells, the DNA isn’t encapsulated within a nucleus and organelles are missing.

The cells from one organism to the next always varies but they do often have many similarities. Almost all cells contain DNA, are surrounded by a membrane, and perform similar functions such as respiration and the production of proteins.

Genes
GenesGenes are the basic unit for heredity. They contain all the information required to keep an organism alive. When organisms reproduce, the information from genes is passed from parent to offspring. The genes that are passed from parent to offspring then provide the information to cells to keep the new organism alive. Genes are the reason why children look similar to their parents.

Evolution
The theory of evolution by natural selection gives by far the best explanation for the huge diversity of species on Earth. The process of natural selection has been sculpting life for over 4 billion years and is the cornerstone of modern biology. The natural selection of useful traits from generation to generation drives the evolution of species over long periods of time.

With the help of genetic mutations, evolution has driven the development of life, capable of thriving in almost any environment on Earth. The process of evolution is visible in all aspects of life. Obvious similarities in structure and function of different species are hard to ignore and the collection of evidence supporting the theory of evolution has become undeniable.

Homeostasis
Homeostasis is the act of maintaining a relatively constant internal environment within an organism’s cells. Cells function most efficiently in a certain range of conditions and as the environment changes around them, they constantly work to keep their internal environment in an optimal condition. Cells are working to maintain factors such as the concentrations of water, salt and sugar, the temperature within the cell, and oxygen concentrations.

Fields of biology
RobinThere is a huge array of sub-disciplines or branches of biology; all up more than 60. Many have been around for hundreds of years, whilst others are far newer and are often developing very rapidly.

Fields of study such as evolution, ecology, and genetics are themselves very broad topics and contain many specializations within each field. For example, an ecologist, who looks at how organisms interact with each other and the environment, might specialize in marine ecology, population ecology, plant ecology or freshwater ecology.


As biology is such a broad field of study, the work from one biologist to another may be completely different. An agriculturalist for example, who is interested in the production of crops, will focus on very different content to that of an ethologist, who studies the behavior of animals. In order to be a well-rounded biologist, however, it is good to have an understanding of the basics of the broad fields within biology.
"""

text_clim = """What Is Climate Change?
Climate change refers to long-term shifts in temperatures and weather patterns. Such shifts can be natural, due to changes in the sun’s activity or large volcanic eruptions. But since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels like coal, oil and gas.

Burning fossil fuels generates greenhouse gas emissions that act like a blanket wrapped around the Earth, trapping the sun’s heat and raising temperatures.

The main greenhouse gases that are causing climate change include carbon dioxide and methane. These come from using gasoline for driving a car or coal for heating a building, for example. Clearing land and cutting down forests can also release carbon dioxide. Agriculture, oil and gas operations are major sources of methane emissions. Energy, industry, transport, buildings, agriculture and land use are among the main sectors causing greenhouse gases.

 

The Earth is feeling the heat.
 

Humans are responsible for global warming
Climate scientists have showed that humans are responsible for virtually all global heating over the last 200 years. Human activities like the ones mentioned above are causing greenhouse gases that are warming the world faster than at any time in at least the last two thousand years.

The average temperature of the Earth’s surface is now about 1.2°C warmer than it was in the late 1800s (before the industrial revolution) and warmer than at any time in the last 100,000 years. The last decade (2011-2020) was the warmest on record, and each of the last four decades has been warmer than any previous decade since 1850.

Many people think climate change mainly means warmer temperatures. But temperature rise is only the beginning of the story. Because the Earth is a system, where everything is connected, changes in one area can influence changes in all others.

The consequences of climate change now include, among others, intense droughts, water scarcity, severe fires, rising sea levels, flooding, melting polar ice, catastrophic storms and declining biodiversity.

 

The Earth is asking for help.
 

People are experiencing climate change in diverse ways
Climate change can affect our health, ability to grow food, housing, safety and work. Some of us are already more vulnerable to climate impacts, such as people living in small island nations and other developing countries. Conditions like sea-level rise and saltwater intrusion have advanced to the point where whole communities have had to relocate, and protracted droughts are putting people at risk of famine. In the future, the number of people displaced by weather-related events is expected to rise.

 

Every increase in global warming matters
In a series of UN reports, thousands of scientists and government reviewers agreed that limiting global temperature rise to no more than 1.5°C would help us avoid the worst climate impacts and maintain a livable climate. Yet policies currently in place point to up to 3.1°C of warming by the end of the century.

The emissions that cause climate change come from every part of the world and affect everyone, but some countries produce much more than others. The six biggest emitters (China, the United States of America, India, the European Union, the Russian Federation, and Brazil) together accounted for more than half of all global greenhouse gas emissions in 2023. By contrast, the 45 least developed countries accounted for only 3 per cent of global greenhouse gas emissions.

Everyone must take climate action, but people and countries creating more of the problem have a greater responsibility to act first.

 

Photocomposition: an image of the world globe looking worried to a thermometer with raising temperatures
 

We face a huge challenge but already know many solutions
Many climate change solutions can deliver economic benefits while improving our lives and protecting the environment. We also have global frameworks and agreements to guide progress, such as the Sustainable Development Goals, the UN Framework Convention on Climate Change and the Paris Agreement. Three broad categories of action are: cutting emissions, adapting to climate impacts and financing required adjustments.

Switching energy systems from fossil fuels to renewables like solar or wind will reduce the emissions driving climate change. But we have to act now. While a growing number of countries is committing to net zero emissions by 2050, emissions must be cut in half by 2030 to keep warming below 1.5°C. Achieving this means huge declines in the use of coal, oil and gas: production and consumption of all fossil fuels need to be cut by at least 30 per cent by 2030 in order to prevent catastrophic levels of climate change."""

bio_kb.upload_knowledge_1(text=[text_bio], source_name="online_bio", chunker=recursive_chunker)
clim_kb.upload_knowledge_1(text=[text_clim], source_name="online_clim", chunker=recursive_chunker)