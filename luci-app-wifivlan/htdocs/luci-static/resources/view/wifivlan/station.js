'use strict';
'require form';
'require view';
'require uci';
'require fs';
return view.extend({
  /**
   * 
   * @param {*} m 
   * @param {*} s 
   * @param {*} o 
   * @param {PointerEvent} ev 
   * @param {*} section_id 
   */
  createQRcode:function(m,s,o,ev,section_id){
    /**
     * @type {Node}
     */
    var p=ev.target.parentElement.parentElement;
    var ifaceInput = document.getElementById('widget.cbid.wireless.%s.iface'.format(section_id));
    var keyInput = document.getElementById('widget.cbid.wireless.%s.key'.format(section_id));
    var psk=keyInput.value;
    var ssid=uci.get("wireless",ifaceInput.value,"ssid");
    L.resolveDefault(fs.exec_direct('/usr/bin/qrencode', ['--inline', '--8bit', '--type=SVG', '--output=-', 'WIFI:S:' + ssid + ';T:WPA;P:' + psk + ';']), null).then(function (res) {
      if (res) {
        if(p.lastChild.nodeName.toLowerCase()=="svg"){
          p.lastChild.remove()
        }
        var e=document.createElement("svg");
        p.appendChild(e);
        e.outerHTML = res.trim();
      }
    });
  },

  load: function() {
    return Promise.all([
      uci.load('wireless')
    ]);
  },
  render: function(data) {
    var m, s, o;

    m = new form.Map('wireless', _('wifi-station'));
    s = m.section(form.GridSection, 'wifi-station');
		s.addremove = true;
		s.anonymous = true;
		s.nodescriptions = true;
    o = s.option(form.Value, 'iface', _('Wireless interface'),
       _('Input for the iface'));
    o = s.option(form.Value, 'vid', _('vid'),
       _('Input for the vid'));
    o = s.option(form.Value, 'comment', _('comment'),
      _('Input for the vid'));
    o = s.option(form.Value, 'key', _('key'),
    _('Input for the key'));
    o.password=true;
    o.modalonly =true;
    o = s.option(form.Button,"qrcode",_('create QRcode'));
    o.modalonly = true;
    o.onclick = L.bind(this.createQRcode,this,m,s,o);

    
    return m.render();
  }
});
