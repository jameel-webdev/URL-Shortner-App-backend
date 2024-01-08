import asyncHandler from "express-async-handler";
import Url from "../models/urlModel.js";
import crypto from "crypto";

export const fullUrl = asyncHandler(async (req, res) => {
  const { fullurl } = req.body;
  if (!fullurl) return res.status(401).json({ message: `Provide Long URL` });
  if (fullurl) {
    const urlExists = await Url.findOne({ fullurl });
    if (urlExists) {
      return res.status(401).json({
        fullurl,
        shortUrl: urlExists.shortUrl,
        message: `Provided url already have shortened url`,
      });
    }
    const shortLink = crypto.randomBytes(3).toString("hex");
    const newUrl = await Url.create({
      fullUrl: fullurl,
      shortUrl: shortLink,
      clicks: 0,
    });
    res.status(201).json({
      shorty: newUrl.shortUrl,
      clicks: newUrl.clicks,
      message: `Short URL Created`,
    });
  }
});

export const shortUrl = asyncHandler(async (req, res) => {
  const shortid = req.params.shorturl;
  let clicks = 0;
  if (shortid) {
    const fetchShorty = await Url.find({ shortid });
    if (!fetchShorty)
      return res.status(400).json({ message: `This Url not available` });
    if (fetchShorty) {
      const shorty = await Url.findOneAndUpdate(
        { shortUrl: shortid },
        {
          clicks: clicks + 1,
        }
      );
      res.redirect(shorty.fullUrl);
    }
  }
});
