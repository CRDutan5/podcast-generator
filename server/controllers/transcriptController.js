export const generateFromTranscript = async (req, res) => {
  try {
    res.status(200).json({
      message: "Successfully reached transcript generation endpoint",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in transcript generation",
      error: error.message,
    });
  }
};
