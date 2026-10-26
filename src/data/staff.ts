import type { L } from "@/lib/i18n";

/**
 * PERSONNEL DIRECTORY.
 * To add an employee, append an object to STAFF.
 *
 * PUZZLE (do not reveal on site): the archive password is built from the
 * last two digits of the ID of every employee whose status is "suspended",
 * ordered by start date (oldest first), each number read as a position in the
 * Latin alphabet: 02 21 26 26 05 18 -> B U Z Z E R. The rule is hinted at in
 * Order No. 14 (about page) and on the documentation page.
 * NOTE: password is now ITSALIE, hinted via Caesar cipher (LWVDOLH, shift 3) in Order No. 14.
 * If you change ARCHIVE_PASSWORD (src/data/documents.ts), update these IDs.
 */
export type Status = "active" | "retired" | "left" | "suspended" | "deceased";

export const STATUS: Record<Status, L> = {
  active: { ru: "Работает", en: "Employed" },
  retired: { ru: "На пенсии", en: "Retired" },
  left: { ru: "Уволен(а) по собств. желанию", en: "Resigned" },
  suspended: { ru: "Учётная запись приостановлена", en: "Record suspended" },
  deceased: { ru: "Умер(ла)", en: "Deceased" },
};

export type Staff = { ru: string; en: string; title: L; dept: L; id: string; start: string; status: Status };

const D = {
  gen: { ru: "Общепсихиатрическое отд.", en: "General Psychiatry" },
  psy: { ru: "Отд. клинической психологии", en: "Clinical Psychology" },
  neu: { ru: "Отд. неврологического наблюдения", en: "Neurological Observation" },
  reh: { ru: "Реабилитационное отд.", en: "Rehabilitation" },
  ltc: { ru: "Отд. длительного пребывания", en: "Long-term Care" },
  adm: { ru: "Администрация", en: "Administration" },
  arc: { ru: "Архив", en: "Archive" },
  eng: { ru: "Хозяйственная служба", en: "Maintenance Service" },
};

export const STAFF: Staff[] = [
  { ru: "Громов Виктор Николаевич", en: "Gromov, Viktor Nikolaevich", title: { ru: "Главный врач", en: "Chief Physician" }, dept: D.adm, id: "ПБ3-101-47", start: "12.08.1986", status: "suspended" },
  { ru: "Соколов Аркадий Павлович", en: "Sokolov, Arkady Pavlovich", title: { ru: "Зав. отделением, врач-психиатр высшей категории", en: "Head of Department, Senior Psychiatrist" }, dept: D.neu, id: "ПБ3-204-02", start: "03.09.1979", status: "suspended" },
  { ru: "Мельникова Ирина Георгиевна", en: "Melnikova, Irina Georgievna", title: { ru: "Старшая медицинская сестра", en: "Senior Nurse" }, dept: D.neu, id: "ПБ3-311-21", start: "15.02.1984", status: "suspended" },
  { ru: "Тихонова Валентина Сергеевна", en: "Tikhonova, Valentina Sergeevna", title: { ru: "Зам. главного врача по медицинской части", en: "Deputy Chief Physician (Medical)" }, dept: D.adm, id: "ПБ3-102-33", start: "01.10.1982", status: "suspended" },
  { ru: "Захаров Олег Викторович", en: "Zakharov, Oleg Viktorovich", title: { ru: "Врач-невролог", en: "Neurologist" }, dept: D.neu, id: "ПБ3-207-26", start: "19.08.1991", status: "suspended" },
  { ru: "Ефимов Борис Ильич", en: "Efimov, Boris Ilyich", title: { ru: "Врач-психиатр", en: "Psychiatrist" }, dept: D.gen, id: "ПБ3-215-09", start: "04.04.1977", status: "suspended" },
  { ru: "Карпенко Нина Степановна", en: "Karpenko, Nina Stepanovna", title: { ru: "Заведующая архивом", en: "Head Archivist" }, dept: D.arc, id: "ПБ3-501-26", start: "06.03.1995", status: "suspended" },
  { ru: "Орлова Татьяна Михайловна", en: "Orlova, Tatyana Mikhailovna", title: { ru: "Медицинский психолог", en: "Clinical Psychologist" }, dept: D.psy, id: "ПБ3-402-14", start: "11.09.1993", status: "suspended" },
  { ru: "Белов Дмитрий Андреевич", en: "Belov, Dmitry Andreevich", title: { ru: "Медбрат палатный", en: "Ward Nurse" }, dept: D.neu, id: "ПБ3-318-05", start: "22.11.1999", status: "suspended" },
  { ru: "Ковалёв Сергей Петрович", en: "Kovalyov, Sergei Petrovich", title: { ru: "Зав. реабилитационным отделением", en: "Head of Rehabilitation" }, dept: D.reh, id: "ПБ3-601-38", start: "02.06.1990", status: "suspended" },
  { ru: "Рудакова Светлана Игоревна", en: "Rudakova, Svetlana Igorevna", title: { ru: "Медицинский регистратор", en: "Medical Records Clerk" }, dept: D.arc, id: "ПБ3-503-18", start: "14.01.2002", status: "suspended" },
  { ru: "Никитина Людмила Васильевна", en: "Nikitina, Lyudmila Vasilyevna", title: { ru: "Зав. отделением длительного пребывания", en: "Head of Long-term Care" }, dept: D.ltc, id: "ПБ3-701-11", start: "17.07.1985", status: "suspended" },
  { ru: "Фролов Геннадий Юрьевич", en: "Frolov, Gennady Yurievich", title: { ru: "Врач-психиатр", en: "Psychiatrist" }, dept: D.gen, id: "ПБ3-221-40", start: "09.09.1996", status: "suspended" },
  { ru: "Смирнова Ольга Анатольевна", en: "Smirnova, Olga Anatolyevna", title: { ru: "Зав. отделением клинической психологии", en: "Head of Clinical Psychology" }, dept: D.psy, id: "ПБ3-401-29", start: "01.02.1992", status: "suspended" },
  { ru: "Абрамов Пётр Кузьмич", en: "Abramov, Pyotr Kuzmich", title: { ru: "Электромонтёр", en: "Electrician" }, dept: D.eng, id: "ПБ3-801-07", start: "05.05.1981", status: "suspended" },
  { ru: "Яковлева Елена Борисовна", en: "Yakovleva, Elena Borisovna", title: { ru: "Медицинская сестра", en: "Nurse" }, dept: D.ltc, id: "ПБ3-712-31", start: "20.03.1998", status: "suspended" },
  { ru: "Лебедев Константин Олегович", en: "Lebedev, Konstantin Olegovich", title: { ru: "Начальник отдела кадров", en: "Head of Personnel" }, dept: D.adm, id: "ПБ3-104-22", start: "10.10.1994", status: "suspended" },
  { ru: "Шевченко Андрей Викторович", en: "Shevchenko, Andrei Viktorovich", title: { ru: "Инженер хозяйственной службы", en: "Facilities Engineer" }, dept: D.eng, id: "ПБ3-803-16", start: "28.08.2000", status: "suspended" },
];

export const toEnId = (id: string) => id.replace("ПБ3", "PB3");
