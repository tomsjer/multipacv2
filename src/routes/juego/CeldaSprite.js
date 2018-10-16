export default function celdaSprite(celda, ctx) {
  /*
    BD = Borde doble
    BS = Borde simple
    C  = Corner
    CR = Corner recto
    T  = Top
    B  = Bottom
    L  = Left
    R  = Right
    T[T|B|L|R] = 'T' [Top|Bottom|Left|Right]
  */
  switch(celda.estado) {
  // BD: CTL
  case 10:
    ctx.beginPath();
    ctx.arc(celda.w, celda.h, celda.w / 2 + 4, Math.PI, (Math.PI / 180) * 270);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(celda.w, celda.h, celda.w / 2, Math.PI, (Math.PI / 180) * 270);
    ctx.stroke();
    break;
  // BD: CTR
  case 11:
    ctx.beginPath();
    ctx.arc(0, celda.h, celda.w / 2 + 4, (Math.PI / 180) * 270, 0, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, celda.h, celda.w / 2, (Math.PI / 180) * 270, 0, false);
    ctx.stroke();
    break;
  // BD: CBL
  case 12:
    ctx.beginPath();
    ctx.arc(celda.w, 0, celda.w / 2 + 4, (Math.PI / 180) * 90, Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(celda.w, 0, celda.w / 2, (Math.PI / 180) * 90, Math.PI, false);
    ctx.stroke();
    break;
  // BD: CBR
  case 13:
    ctx.beginPath();
    ctx.arc(0, 0, celda.w / 2 + 4, 0, (Math.PI / 180) * 90, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, celda.w / 2, 0, (Math.PI / 180) * 90, false);
    ctx.stroke();
    break;

  // BD: BT
  case 14:
    ctx.beginPath();
    ctx.moveTo(0, celda.h / 2 - 4);
    ctx.lineTo(celda.w, celda.h / 2 - 4);
    ctx.moveTo(0, celda.h / 2);
    ctx.lineTo(celda.w, celda.h / 2);
    ctx.stroke();
    break;
  // BD: BR
  case 15:
    ctx.beginPath();
    ctx.moveTo(celda.w / 2 + 4, 0);
    ctx.lineTo(celda.w / 2 + 4, celda.h);
    ctx.moveTo(celda.w / 2, 0);
    ctx.lineTo(celda.w / 2, celda.h);
    ctx.stroke();
    break;
  // BD: BL
  case 16:
    ctx.beginPath();
    ctx.moveTo(celda.w / 2 - 4, 0);
    ctx.lineTo(celda.w / 2 - 4, celda.h);
    ctx.moveTo(celda.w / 2, 0);
    ctx.lineTo(celda.w / 2, celda.h);
    ctx.stroke();
    break;
  // BD: BB
  case 17:
    ctx.beginPath();
    ctx.moveTo(0, celda.h / 2 + 4);
    ctx.lineTo(celda.w, celda.h / 2 + 4);
    ctx.moveTo(0, celda.h / 2);
    ctx.lineTo(celda.w, celda.h / 2);
    ctx.stroke();
    break;
  // BD: TTL
  case 18:
    ctx.beginPath();
    ctx.moveTo(0, celda.h / 2 - 4);
    ctx.lineTo(celda.w, celda.h / 2 - 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, celda.h, celda.w / 2,  (Math.PI / 180) * 270, 0, false);
    ctx.stroke();
    break;
  // BD: TTR
  case 19:
    ctx.beginPath();
    ctx.moveTo(0, celda.h / 2 - 4);
    ctx.lineTo(celda.w, celda.h / 2 - 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(celda.w, celda.h, celda.w / 2, Math.PI,  (Math.PI / 180) * 270, false);
    ctx.stroke();
    break;
  // BD: TLT
  case 20:
    ctx.beginPath();
    ctx.moveTo(celda.w / 2 - 4, 0);
    ctx.lineTo(celda.w / 2 - 4, celda.h);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(celda.w, 0, celda.w / 2, (Math.PI / 180) * 90, Math.PI, false);
    ctx.stroke();
    break;
  // BD: TRT
  case 21:
    ctx.beginPath();
    ctx.moveTo(celda.w / 2 + 4, 0);
    ctx.lineTo(celda.w / 2 + 4, celda.h);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, celda.w / 2, 0, (Math.PI / 180) * 90, false);
    ctx.stroke();
    break;
  // BD: TLB
  case 22:
    ctx.beginPath();
    ctx.moveTo(celda.w / 2 - 4, 0);
    ctx.lineTo(celda.w / 2 - 4, celda.h);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(celda.w, celda.h, celda.w / 2, Math.PI, (Math.PI / 180) * 270, false);
    ctx.stroke();
    break;
  // BD: TRB
  case 23:
    ctx.beginPath();
    ctx.moveTo(celda.w / 2 + 4, 0);
    ctx.lineTo(celda.w / 2 + 4, celda.h);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, celda.h, celda.w / 2, (Math.PI / 180) * 270, 0, false);
    ctx.stroke();
    break;
  // BS: CTL
  case 24:
    ctx.beginPath();
    ctx.arc(celda.w, celda.h, celda.w / 2, Math.PI, (Math.PI / 180) * 270);
    ctx.stroke();
    break;
  // BS: CTR
  case 25:
    ctx.beginPath();
    ctx.arc(0, celda.h, celda.w / 2 , (Math.PI / 180) * 270, 0, false);
    ctx.stroke();
    break;
  // BS: CBL
  case 26:
    ctx.beginPath();
    ctx.arc(celda.w, 0, celda.w / 2, (Math.PI / 180) * 90, Math.PI, false);
    ctx.stroke();
    break;
  // BS: CBR
  case 27:
    ctx.beginPath();
    ctx.arc(0, 0, celda.w / 2, 0, (Math.PI / 180) * 90, false);
    ctx.stroke();
    break;
  // BD: CRTL
  case 28:
    ctx.beginPath();

    ctx.moveTo(celda.w / 2, celda.h);
    ctx.lineTo(celda.w / 2, celda.h / 2);
    ctx.moveTo(celda.w / 2, celda.h / 2);
    ctx.lineTo(celda.w, celda.h / 2);

    ctx.moveTo(celda.w / 2 + 4, celda.h);
    ctx.lineTo(celda.w / 2 + 4, celda.h / 2 + 4);
    ctx.moveTo(celda.w / 2 + 4, celda.h / 2 + 4);
    ctx.lineTo(celda.w, celda.h / 2 + 4);

    ctx.stroke();
    break;
  // BD: CRTR
  case 29:
    ctx.beginPath();

    ctx.moveTo(celda.w / 2, celda.h);
    ctx.lineTo(celda.w / 2, celda.h / 2);
    ctx.moveTo(celda.w / 2, celda.h / 2);
    ctx.lineTo(0, celda.h / 2);

    ctx.moveTo(celda.w / 2 - 4, celda.h);
    ctx.lineTo(celda.w / 2 - 4, celda.h / 2 + 4);
    ctx.moveTo(celda.w / 2 - 4, celda.h / 2 + 4);
    ctx.lineTo(0, celda.h / 2 + 4);

    ctx.stroke();
    break;
  // BD: CRTL
  case 30:
    ctx.beginPath();

    ctx.moveTo(celda.w / 2, 0);
    ctx.lineTo(celda.w / 2, celda.h / 2);
    ctx.moveTo(celda.w / 2, celda.h / 2);
    ctx.lineTo(celda.w, celda.h / 2);

    ctx.moveTo(celda.w / 2 + 4, 0);
    ctx.lineTo(celda.w / 2 + 4, celda.h / 2 - 4);
    ctx.moveTo(celda.w / 2 + 4, celda.h / 2 - 4);
    ctx.lineTo(celda.w, celda.h / 2 - 4);

    ctx.stroke();
    break;
  // BD: CRBR
  case 31:
    ctx.beginPath();

    ctx.moveTo(celda.w / 2, 0);
    ctx.lineTo(celda.w / 2, celda.h / 2);
    ctx.moveTo(celda.w / 2, celda.h / 2);
    ctx.lineTo(0, celda.h / 2);

    ctx.moveTo(celda.w / 2 - 4, 0);
    ctx.lineTo(celda.w / 2 - 4, celda.h / 2 - 4);
    ctx.moveTo(celda.w / 2 - 4, celda.h / 2 - 4);
    ctx.lineTo(0, celda.h / 2 - 4);

    ctx.stroke();
    break;
  // BS: BB
  // BS: BT
  case 32:
  case 33:
    ctx.beginPath();
    ctx.moveTo(0, celda.h / 2);
    ctx.lineTo(celda.w, celda.h / 2);
    ctx.stroke();
    break;
  // BS: BR
  // BS: BL
  case 34:
  case 35:
    ctx.beginPath();
    ctx.moveTo(celda.w / 2, 0);
    ctx.lineTo(celda.w / 2, celda.h);
    ctx.stroke();
    break;
  // BS: CTL
  case 36:
    ctx.beginPath();
    ctx.arc(0, celda.h, celda.w / 2, (Math.PI / 180) * 270, 0, false);
    ctx.stroke();
    break;
  // BD: CTR (IN)
  case 37:
    ctx.beginPath();
    ctx.arc(celda.w, celda.h, celda.w / 2, Math.PI, (Math.PI / 180) * 270);
    ctx.stroke();
    break;
  // BD: CTL (IN)
  case 38:
    ctx.beginPath();
    ctx.arc(celda.w, celda.h, celda.w / 2 - 4, Math.PI, (Math.PI / 180) * 270);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(celda.w, celda.h, celda.w / 2, Math.PI, (Math.PI / 180) * 270);
    ctx.stroke();
    break;
  // BD: CTR (IN)
  case 39:
    ctx.beginPath();
    ctx.arc(0, celda.h, celda.w / 2 - 4, (Math.PI / 180) * 270, 0, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, celda.h, celda.w / 2, (Math.PI / 180) * 270, 0, false);
    ctx.stroke();
    break;
  // BD: CBL
  case 40:
    ctx.beginPath();
    ctx.arc(celda.w, 0, celda.w / 2 - 4, (Math.PI / 180) * 90, Math.PI, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(celda.w, 0, celda.w / 2, (Math.PI / 180) * 90, Math.PI, false);
    ctx.stroke();
    break;
  // BD: CBR (IN)
  case 41:
    ctx.beginPath();
    ctx.arc(0, 0, celda.w / 2 - 4, 0, (Math.PI / 180) * 90, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, celda.w / 2, 0, (Math.PI / 180) * 90, false);
    ctx.stroke();
    break;
  // BS: CBR
  case 42:
    ctx.beginPath();
    ctx.arc(0, 0, celda.w / 2, 0, (Math.PI / 180) * 90, false);
    ctx.stroke();
    break;
  // BS: CBL
  case 43:
    ctx.beginPath();
    ctx.arc(celda.w, 0, celda.w / 2, (Math.PI / 180) * 90, Math.PI, false);
    ctx.stroke();
    break;
  default:
    // console.log(celda);
    // ctx.strokeStyle = '#222';
    // ctx.strokeRect(0,0, celda.w, celda.h);
    break;
  }
}
