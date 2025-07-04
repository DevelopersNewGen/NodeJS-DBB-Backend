import axios from "axios";

export const exchangeConverter = async (req, res) => {
  try {
    const path = process.env.EXCHANGERATE_API_URL;
    const key = process.env.EXCHANGERATE_API_KEY;
    const { from, to, amount } = req.body;
    const url = `${path}/${key}/pair/${from}/${to}/${amount}`;

    const response = await axios.get(url);

    if (response.data?.result === 'success') {
      return res.status(200).json({
        base: from,
        target: to,
        conversionRate:   response.data.conversion_rate,
        conversionAmount: response.data.conversion_result
      });
    } else {
      return res.status(400).json({
        msg: 'Error al convertir las divisas',
        details: response.data
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "Error al realizar la conversión de divisas",
      error: error.message,
    });
  }
};