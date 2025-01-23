export const generatePodcast = async (req, res) => {
  try {
    res.status(200).json({ message: "Generate Podcast" });
  } catch (error) {
    res.status(400).json({ message: "Error in generating podcast" });
  }
};
