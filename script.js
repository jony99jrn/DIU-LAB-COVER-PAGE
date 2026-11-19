window.addEventListener('DOMContentLoaded', () => {
  const formScreen = document.getElementById('formScreen');
  const previewScreen = document.getElementById('previewScreen');

  const generateBtn = document.getElementById('generateBtn');
  const editBtn = document.getElementById('editBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const downloadImgBtn = document.getElementById('downloadImgBtn');

  generateBtn.addEventListener('click', () => {
    const experimentNo = document.getElementById('experimentNo').value.trim() || '01';
    const experimentName = document.getElementById('experimentName').value.trim() || 'PPS';
    const courseCode = document.getElementById('courseCode').value.trim() || 'CSE 114';
    const courseTitle = document.getElementById('courseTitle').value.trim() || 'Programming and Problem Solving';

    const teacherName = document.getElementById('teacherName').value.trim() || 'Khandoker Nosiba Arifin';
    const teacherDesig = document.getElementById('teacherDesig').value.trim() || 'Lecturer';
    const teacherDept = document.getElementById('teacherDept').value.trim() || 'Computer Science and Engineering';

    const studentName = document.getElementById('studentName').value.trim() || 'Jony Roy';
    const studentId = document.getElementById('studentId').value.trim() || '262-15-952';
    const section = document.getElementById('section').value.trim() || '72_S';
    const semester = document.getElementById('semester').value.trim() || 'Fall 2026';
    const studentDept = document.getElementById('studentDept').value.trim() || 'Computer Science and Engineering';

    const subDateVal = document.getElementById('subDate').value;

    document.getElementById('prevExperimentNo').innerText = experimentNo;
    document.getElementById('prevExperimentName').innerText = experimentName;
    document.getElementById('prevCourseCode').innerText = courseCode;
    document.getElementById('prevCourseTitle').innerText = courseTitle;

    document.getElementById('prevTeacherName').innerText = teacherName;
    document.getElementById('prevTeacherDesig').innerText = teacherDesig;
    document.getElementById('prevTeacherDept').innerText = teacherDept;

    document.getElementById('prevStudentName').innerText = studentName;
    document.getElementById('prevStudentId').innerText = studentId;
    document.getElementById('prevSection').innerText = section;
    document.getElementById('prevSemester').innerText = semester;
    document.getElementById('prevStudentDept').innerText = studentDept;

    if (subDateVal) {
      const [year, month, day] = subDateVal.split('-');
      document.getElementById('prevSubDate').innerText = `${day}/${month}/${year}`;
    } else {
      document.getElementById('prevSubDate').innerText = '25/09/2026';
    }

    formScreen.style.setProperty('display', 'none', 'important');
    previewScreen.classList.remove('hidden');
    window.scrollTo(0, 0);
  });

  editBtn.addEventListener('click', () => {
    previewScreen.classList.add('hidden');
    formScreen.style.setProperty('display', 'flex', 'important');
  });

  // Capture the cover page from a fixed-size off-screen copy (A4 at 96dpi),
  // so the result never depends on the phone/laptop screen width or zoom.
  const PAGE_W = 794;   // 210mm
  const PAGE_H = 1115;  // 295mm

  async function renderCoverCanvas(scale) {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const source = document.getElementById('coverPage');
    const stage = document.createElement('div');
    stage.style.cssText =
      'position:fixed;left:-10000px;top:0;width:' + PAGE_W + 'px;height:' + PAGE_H + 'px;' +
      'overflow:hidden;pointer-events:none;';

    const clone = source.cloneNode(true);
    clone.style.width = PAGE_W + 'px';
    clone.style.height = PAGE_H + 'px';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.transform = 'none';

    stage.appendChild(clone);
    document.body.appendChild(stage);

    try {
      return await html2canvas(clone, {
        scale: scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: PAGE_W,
        height: PAGE_H,
        windowWidth: PAGE_W,
        windowHeight: PAGE_H,
        scrollX: 0,
        scrollY: 0
      });
    } finally {
      document.body.removeChild(stage);
    }
  }

  function withBusy(btn, work) {
    const label = btn.innerHTML;
    btn.innerHTML = 'Preparing…';
    btn.disabled = true;
    return work()
      .catch(() => alert('Could not generate the file. Please try again.'))
      .finally(() => {
        btn.innerHTML = label;
        btn.disabled = false;
      });
  }

  downloadBtn.addEventListener('click', () => {
    withBusy(downloadBtn, async () => {
      const canvas = await renderCoverCanvas(2);
      const options = {
        margin: 0,
        filename: 'DIU_Lab_Report_Cover_Page.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(options).from(canvas, 'canvas').save();
    });
  });

  downloadImgBtn.addEventListener('click', () => {
    withBusy(downloadImgBtn, async () => {
      const canvas = await renderCoverCanvas(3);
      const link = document.createElement('a');
      link.download = 'DIU_Lab_Report_Cover_Page.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    });
  });
});
