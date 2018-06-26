function getIpAddress(interfaces) {
  const ips = [];
  Object.keys(interfaces).forEach((ifname)=>{
    let alias = 0;

    interfaces[ifname].forEach((iface)=>{
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        // console.log(ifname + ':' + alias, iface.address);
      }
      else {
        // this interface has only one ipv4 adress
        // console.log(ifname, iface.address);
      }
      alias++;
      ips.push(iface.address);
    });
  });
  // Keep just the first one.
  return ips[0];
}

module.exports = getIpAddress;
