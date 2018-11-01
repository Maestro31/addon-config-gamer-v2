require(['jquery', 'domReady'], function($, domReady) {
  domReady(function() {
    $('#btnResetFilter').on('click', function() {
      window.location =
        '/pages/produits_cat_est_ordinateurs_puis_rubrique_est_w_pc.html';
    });

    $('button.toggleHiddenFilters').on('click', function(e) {
      e.preventDefault();
      $('#filtres').addClass('open');
    });

    $('#btnActivateFilter').on('click', function() {
      var urlCurrent =
        '//' + window.location.hostname + document.location.pathname;
      urlCurrent = decodeURIComponent(urlCurrent);
      urlCurrent = urlCurrent.replace(
        /_puis_f_est_[0-9\-,p|_]{0,}?.html/,
        '.html'
      );
      urlCurrent = urlCurrent.replace(
        /_puis_f_est_[0-9\-,p|_]{0,}?_puis_/,
        '_puis_'
      );
      //urlCurrent = urlCurrent.replace(/_puis_f_est_[0-9\-,p(\||%7C)_]{0,}?.html/, '.html');
      //urlCurrent = urlCurrent.replace(/_puis_f_est_[0-9(\||%7C)\-p,_]{0,}?_puis_/, '_puis_');
      urlCurrent = urlCurrent.replace(
        /_puis_msg_est_[0-9]{1,}?_puis_/,
        '_puis_'
      );
      urlCurrent = urlCurrent.replace(/_puis_msg_est_[0-9]{1,}?.html/, '.html');
      //urlCurrent = urlCurrent.replace(/_puis_nb_articles_total_est_[0-9]{0,}/, '');
      urlCurrent = urlCurrent.replace(/_puis_marque_est_(.*)?\.html/, '.html');
      urlCurrent = urlCurrent.replace(/_puis_marque_est_(.*)?_puis_/, '_puis_');
      urlCurrent = urlCurrent.replace(/_puis_page_est_[0-9]?_puis_/, '_puis_');
      urlCurrent = urlCurrent.replace(/_puis_page_est_[0-9]?.html/, '.html');

      var url = '';
      var c = 0;
      var test = '';

      $('#filtres div.bloc-filter').each(function(i, obj1) {
        var id_attr = $(obj1).attr('id');
        var datatype = $(obj1).attr('data-type-filter');

        if (datatype == 'combo') {
          var sIdValuesCombo = '';
          $(obj1)
            .find('input:checked')
            .each(function(j, obj2) {
              sIdValuesCombo += $(obj2).val() + ',';
            });
          sIdValuesCombo = sIdValuesCombo.substr(0, sIdValuesCombo.length - 1);
          if (sIdValuesCombo != '') {
            //oValues[ $(obj1).attr('id') ] = sIdValues;
            url += $(obj1).attr('id') + '-' + sIdValuesCombo + '|';
          }
        }
        if (datatype == 'ruler') {
          var sIdValuesRuler = '';
          var isRulerChanged = false;
          var isMinEqual = true;
          var isMaxEqual = true;

          $(obj1)
            .find('.handle.min')
            .each(function(j, obj2) {
              if ($(obj2).attr('data-value-min') != $(obj2).attr('data-value'))
                isMinEqual = false;
              sIdValuesRuler += $(obj2).attr('data-value') + '_';
            });

          $(obj1)
            .find('.handle.max')
            .each(function(j, obj2) {
              if ($(obj2).attr('data-value-max') != $(obj2).attr('data-value'))
                isMaxEqual = false;
              sIdValuesRuler += $(obj2).attr('data-value');
            });

          if (isMinEqual === false || isMaxEqual === false)
            isRulerChanged = true;

          if (sIdValuesRuler != '' && isRulerChanged === true)
            url += $(obj1).attr('id') + '-' + sIdValuesRuler + '|';
          //console.log(isMinEqual+' / '+isMaxEqual+' URL:'+url);
        }
      });

      if (url != '') {
        url = url.substr(0, url.length - 1);
        url = urlCurrent.replace('.html', '') + '_puis_f_est_' + url + '.html';
        window.location = url;
      } else url = urlCurrent;
      console.log(url);
    });
  });
});

function valideTri() {
  var SortEnable = document.getElementById('selectSort').value;

  switch (SortEnable) {
    case 'RDESC':
      window.location =
        '/pages/produits_cat_est_ordinateurs_puis_rubrique_est_w_pc_puis_ordre_est_R_puis_sens_est_DESC_puis_f_est_690-7997_8622.html';
      break;
    case 'SDESC':
      window.location =
        '/pages/produits_cat_est_ordinateurs_puis_rubrique_est_w_pc_puis_f_est_690-7997_8622.html';
      break;
    case 'NDESC':
      window.location =
        '/pages/produits_cat_est_ordinateurs_puis_rubrique_est_w_pc_puis_ordre_est_N_puis_sens_est_DESC_puis_f_est_690-7997_8622.html';
      break;
    case 'LASC':
      window.location =
        '/pages/produits_cat_est_ordinateurs_puis_rubrique_est_w_pc_puis_ordre_est_L_puis_sens_est_ASC_puis_f_est_690-7997_8622.html';
      break;
    case 'LDESC':
      window.location =
        '/pages/produits_cat_est_ordinateurs_puis_rubrique_est_w_pc_puis_ordre_est_L_puis_sens_est_DESC_puis_f_est_690-7997_8622.html';
      break;
    case 'PASC':
      window.location =
        '/pages/produits_cat_est_ordinateurs_puis_rubrique_est_w_pc_puis_ordre_est_P_puis_sens_est_ASC_puis_f_est_690-7997_8622.html';
      break;
    case 'PDESC':
      window.location =
        '/pages/produits_cat_est_ordinateurs_puis_rubrique_est_w_pc_puis_ordre_est_P_puis_sens_est_DESC_puis_f_est_690-7997_8622.html';
      break;
    case 'XDESC':
      window.location =
        '/pages/produits_cat_est_ordinateurs_puis_rubrique_est_w_pc_puis_ordre_est_X_puis_sens_est_DESC_puis_f_est_690-7997_8622.html';
      break;
  }
}
