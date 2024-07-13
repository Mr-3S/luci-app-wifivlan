'use strict';
'require form';
'require view';
'require tools.widgets as widgets';
'require uci';

return view.extend({
  load: function() {
    return Promise.all([
      uci.load('wireless')
    ]);
  },
  render: function() {
    var m, s, o;

    m = new form.Map('wireless', _('wifi-vlan'));

    s = m.section(form.GridSection, 'wifi-vlan');
		s.addremove = true;
		s.anonymous = true;
		s.nodescriptions = true;

    o = s.option(form.Value, 'name', _('name'));
    o = s.option(form.Value, 'iface', _('Wireless interface'),
       _('Input for the iface'));
    o = s.option(form.Value, 'vid', _('vid'),
       _('Input for the vid'));
    o = s.option(widgets.NetworkSelect,'network',_('network'));
    o.novirtual = true;
    o.nocreate = true;
    return m.render();
  },
});
