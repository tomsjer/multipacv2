module.exports = function map(val, min, max, minf, maxf) {
  return ((val - min) / (max - min)) * (maxf - minf) + minf;
};
