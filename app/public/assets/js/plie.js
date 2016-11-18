/*

Auteurs : Laurent BRACQUART <lbracquart@atalan.fr>, Sébastien DELORME <sdelorme@atalan.fr>
URL : http://atalan.fr/
Date de création : 05 Juillet 2011
Date de mise à jour : 08 mars 2013
Version : 1.1

Index :

  0/ Masquage des panneaux par défaut
  1/ Initialisation des liens d'accès aux panneaux
  2/ Gestion de l'affichage des panneaux

  Annexes/ Fonctions annexes

*/
/* global $ */
'use strict';

$(document).ready(function()
{
  // 0/ Masquage des panneaux par défaut
  var $panneaux = $('div.testimonial-proprietes').show();
  $('div.plie-ferme').hide();



  // ---------------------------------------------------------------------------------------- //

  // 1/ Initialisation des liens d'accès aux panneaux

  $('h3.titre3').each(function(i)
  {
    var $this = $(this);
    var ancre = $this.next($panneaux)[0].id;

    var lien = $('<a>',
      {
        'href':				'#' + ancre,
        'aria-expanded':	'true',
        'aria-controls':	ancre
      });

    $this.wrapInner(lien);
  });

  // ---------------------------------------------------------------------------------------- //

  // 2/ Gestion de l'affichage des panneaux
  $('h3.titre3 > a').click(function()
  {
    if ($(this).attr('aria-expanded') == 'false')
    {
      $(this).attr('aria-expanded', true).parent().next($panneaux).show();
    }
    else
    {
      $(this).attr('aria-expanded', false).parent().next($panneaux).hide();
    }
    return false;
  });
});


