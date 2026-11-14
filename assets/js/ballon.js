/* ==========================================================================
   ESSAM Handball — ballon du demi-ballon d'accès rapide
   Le ballon est un icosaèdre tronqué (12 pentagones, 20 hexagones), comme un
   vrai ballon de handball. Il est projeté en 2D et roule quand on fait défiler.
   ========================================================================== */
(function () {
  "use strict";
  var groupe = document.querySelector("[data-ballon]");
  if (!groupe) { return; }
  var B = {"v":[[-0.9794,0.0,-0.2018],[-0.9794,0.0,0.2018],[-0.8547,-0.3265,-0.4035],[-0.8547,-0.3265,0.4035],[-0.8547,0.3265,-0.4035],[-0.8547,0.3265,0.4035],[-0.73,-0.653,-0.2018],[-0.73,-0.653,0.2018],[-0.73,0.653,-0.2018],[-0.73,0.653,0.2018],[-0.653,-0.2018,-0.73],[-0.653,-0.2018,0.73],[-0.653,0.2018,-0.73],[-0.653,0.2018,0.73],[-0.4035,-0.8547,-0.3265],[-0.4035,-0.8547,0.3265],[-0.4035,0.8547,-0.3265],[-0.4035,0.8547,0.3265],[-0.3265,-0.4035,-0.8547],[-0.3265,-0.4035,0.8547],[-0.3265,0.4035,-0.8547],[-0.3265,0.4035,0.8547],[-0.2018,-0.9794,0.0],[-0.2018,-0.73,-0.653],[-0.2018,-0.73,0.653],[-0.2018,0.73,-0.653],[-0.2018,0.73,0.653],[-0.2018,0.9794,0.0],[0.0,-0.2018,-0.9794],[0.0,-0.2018,0.9794],[0.0,0.2018,-0.9794],[0.0,0.2018,0.9794],[0.2018,-0.9794,0.0],[0.2018,-0.73,-0.653],[0.2018,-0.73,0.653],[0.2018,0.73,-0.653],[0.2018,0.73,0.653],[0.2018,0.9794,0.0],[0.3265,-0.4035,-0.8547],[0.3265,-0.4035,0.8547],[0.3265,0.4035,-0.8547],[0.3265,0.4035,0.8547],[0.4035,-0.8547,-0.3265],[0.4035,-0.8547,0.3265],[0.4035,0.8547,-0.3265],[0.4035,0.8547,0.3265],[0.653,-0.2018,-0.73],[0.653,-0.2018,0.73],[0.653,0.2018,-0.73],[0.653,0.2018,0.73],[0.73,-0.653,-0.2018],[0.73,-0.653,0.2018],[0.73,0.653,-0.2018],[0.73,0.653,0.2018],[0.8547,-0.3265,-0.4035],[0.8547,-0.3265,0.4035],[0.8547,0.3265,-0.4035],[0.8547,0.3265,0.4035],[0.9794,0.0,-0.2018],[0.9794,0.0,0.2018]],"f":[[19,24,34,39,29],[7,3,1,0,2,6],[15,7,6,14,22],[28,38,33,23,18],[10,2,0,4,12],[8,4,0,1,5,9],[31,29,39,47,49,41],[58,54,46,48,56],[30,28,18,10,12,20],[20,25,35,40,30],[21,13,11,19,29,31],[13,5,1,3,11],[51,43,32,42,50],[55,51,50,54,58,59],[24,15,22,32,43,34],[17,26,36,45,37,27],[33,42,32,22,14,23],[52,44,37,45,53],[59,58,56,52,53,57],[31,41,36,26,21],[57,49,47,55,59],[40,48,46,38,28,30],[27,37,44,35,25,16],[27,16,8,9,17],[47,39,34,43,51,55],[19,11,3,7,15,24],[23,14,6,2,10,18],[20,12,4,8,16,25],[54,50,42,33,38,46],[48,40,35,44,52,56],[57,53,45,36,41,49],[26,17,9,5,13,21]]};
  var RAYON = 50, RETRAIT = 0.84, NS = "http://www.w3.org/2000/svg";
  var polys = B.f.map(function () {
    var p = document.createElementNS(NS, "polygon");
    groupe.appendChild(p);
    return p;
  });

  function tourner(v, ax, ay) {
    var cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
    var y = v[1] * cx - v[2] * sx, z = v[1] * sx + v[2] * cx;
    var x = v[0] * cy + z * sy;
    z = -v[0] * sy + z * cy;
    return [x, y, z];
  }

  function dessiner(angle) {
    var pts = B.v.map(function (v) { return tourner(v, 0.3 + angle, 0.2); });
    B.f.forEach(function (face, k) {
      var c = [0, 0, 0];
      face.forEach(function (i) { c[0] += pts[i][0]; c[1] += pts[i][1]; c[2] += pts[i][2]; });
      c = c.map(function (x) { return x / face.length; });
      var visible = c[2] > 0.05;
      polys[k].style.display = visible ? "" : "none";
      if (!visible) { return; }
      polys[k].setAttribute("points", face.map(function (i) {
        var p = pts[i];
        var x = c[0] + (p[0] - c[0]) * RETRAIT, y = c[1] + (p[1] - c[1]) * RETRAIT, z = c[2] + (p[2] - c[2]) * RETRAIT;
        var n = Math.sqrt(x * x + y * y + z * z);   // ramené sur la sphère
        return (x / n * RAYON).toFixed(1) + "," + (-y / n * RAYON).toFixed(1);
      }).join(" "));
    });
  }

  dessiner(0);
  var calme = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (calme) { return; }
  var enAttente = false;
  window.addEventListener("scroll", function () {
    if (enAttente) { return; }
    enAttente = true;
    window.requestAnimationFrame(function () {
      dessiner(window.scrollY * 0.004);   // le ballon roule vers l'avant en descendant
      enAttente = false;
    });
  }, { passive: true });
})();
