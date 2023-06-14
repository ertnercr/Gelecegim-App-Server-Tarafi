import Iller from "../models/iller.js";
import vdler from "../models/vdler.js";
import ilcelerayri from "../models/ilcelerayri.js";
import Alanlar from "../models/kurumalani.js"
export const getIl = async (req, res) => {
  try {
    const Il = await Iller.find();
    res.status(200).json(Il);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getKurum = async (req, res) => {
  try {
    const Alan = await Alanlar.find();
    res.status(200).json(Alan);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getIlceler = async (req, res) => {
  try {
    const { ad } = req.params;
    const Il = await Iller.findOne({ ad: ad });
    const Plaka = Il.plaka.toString();
    const Ilceler = await ilcelerayri.find({ il_id: Plaka });

    res.status(200).json(Ilceler);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getVdAd = async (req, res) => {
  try {
    const { ad } = req.params;
    const Il = await Iller.findOne({ ad: ad });
    const Vdgetir = await vdler.find({ province_code: Il.plaka });

    res.status(200).json(Vdgetir);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
