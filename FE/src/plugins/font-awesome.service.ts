import {Injectable} from '@angular/core';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';
// import icons from fontawesome
import {
  faAddressCard,
  faAngleDown,
  faBars,
  faBox,
  faBoxes,
  faBoxOpen,
  faCalendar,
  faCalendarDays,
  faCar,
  faCircleLeft,
  faCircleNotch,
  faEdit,
  faEllipsisVertical,
  faEye,
  faEyeSlash,
  faFile,
  faFileInvoice,
  faFileLines,
  faGear,
  faHeart,
  faHome,
  faKey,
  faMapPin,
  faMoon,
  faMotorcycle,
  faPaperPlane,
  faPlus,
  faPrint,
  faRightFromBracket,
  faSchool,
  faScrewdriverWrench,
  faSearch,
  faSquarePlus,
  faTrashAlt,
  faUser,
  faUsers,
  faUserTie,
  faXmark,
  faEnvelope,
  faArrowAltCircleRight,
  faPersonChalkboard,
  faSpinner,
  faCircleCheck,
  faCircleXmark,
  faAnglesLeft,
  faAnglesRight,
  faAngleLeft,
  faAngleRight,
  faMoneyBill,
  faCircleUser,
  faPeopleGroup,
  faBoxesStacked,
  faPercent,
  faRulerCombined,
  faSquarePen,
  faPen,
  faPenToSquare,
  faCarSide,
  faCircleInfo,
  faFilePdf,
  faReceipt,
  faFolder,
  faStar,

} from '@fortawesome/free-solid-svg-icons';

import {faAngular,} from '@fortawesome/free-brands-svg-icons';


@Injectable({
  providedIn: 'root'
})

export class FontAwesomeService {

  constructor(library:FaIconLibrary) {
    // add icons in library for use it
    library.addIcons(
      faKey,
      faHome,
      faBoxes,
      faBoxOpen,
      faUser,
      faAddressCard,
      faRightFromBracket,
      faEllipsisVertical,
      faBars,
      faXmark,
      faMoon,
      faCircleNotch,
      faHeart,
      faAngleDown,
      faEye,
      faEyeSlash,
      faEdit,
      faPaperPlane,
      faSquarePlus,
      faPlus,
      faSearch,
      faTrashAlt,
      faCircleLeft,
      faAngular,
      faBox,
      faUserTie,
      faPrint,
      faGear,
      faCar,
      faMotorcycle,
      faSchool,
      faCalendar,
      faFile,
      faFileInvoice,
      faScrewdriverWrench,
      faCalendarDays,
      faMapPin,
      faAddressCard,
      faUsers,
      faFileInvoice,
      faFileLines,
      faEnvelope,
      faArrowAltCircleRight,
      faPersonChalkboard,
      faSpinner,
      faCircleCheck,
      faCircleXmark,
      faAnglesLeft,
      faAnglesRight,
      faAngleLeft,
      faAngleRight,
      faMoneyBill,
      faCircleUser,
      faPeopleGroup,
      faBoxesStacked,
      faPercent,
      faRulerCombined,
      faSquarePen,
      faPen,
      faPenToSquare,
      faCarSide,
      faCircleInfo,
      faFilePdf,
      faReceipt,
      faFolder,
      faStar,
    );
  }


  // get icon from library by icon name
  getIcon(iconName:string) {
    let icon:any;
    switch (iconName) {
      case 'home': icon = faHome;
        break;
      case 'boxes': icon = faBoxes;
        break;
      case 'box-open': icon = faBoxOpen;
        break;
      case 'eye': icon = faEye;
        break;
      case 'eye-slash': icon = faEyeSlash;
        break;
      case 'user': icon = faUser;
        break;
      case 'screwdriver-wrench': icon = faScrewdriverWrench;
        break;
      case 'user-tie': icon = faUserTie;
        break;
      case 'car': icon = faCar;
        break;
      case 'school': icon = faSchool;
        break;
      case 'calendar-days': icon = faCalendarDays;
        break;
      case 'file-invoice': icon = faFileInvoice;
        break;
      case 'users': icon = faUsers;
        break;
      case 'file-lines': icon = faFileLines;
        break;
      case 'plus': icon = faPlus;
        break;
      case 'edit': icon = faEdit;
        break;
      case 'trash-alt': icon = faTrashAlt;
        break;
      case 'person-chalkboard': icon = faPersonChalkboard;
        break;
      case 'money-bill': icon = faMoneyBill;
        break;
      case 'address-card': icon = faAddressCard;
        break;
      default: icon = 'home';
        break;
    }
    return icon;
  }
}
