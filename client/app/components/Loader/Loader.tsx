import React from 'react'

import s from './Loader.scss'


const Loader = () => (
  <div className={s.cubeWrapper}>
    <div className={s.cubeFolding}>
      <span className={s.leaf1} />
      <span className={s.leaf2} />
      <span className={s.leaf3} />
      <span className={s.leaf4} />
    </div>
  </div>
)


export default Loader
