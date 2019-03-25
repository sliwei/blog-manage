import fetch from '@/assets/js/axios';

/**
 * lw 上传
 */
const upload = data => fetch('/blog/manage/common/upload', {
  data: data, type: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export {
  upload,
}