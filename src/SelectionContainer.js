import React from "react"

function SelectionContainer(props) {
  return (
    <div>
      <div className='absolute top left w300 h180 py12 px12 ml36 mt36 bg-white round-bold prose'>
        <h4>City of Calgary <span class='txt-underline'>Residential Property Assessment</span></h4>
        <div className='w240 mt12 txt-s px6 py6 round shadow-darken10'>
          <div className='grid mb6'>
            <div className='col h12' style={{backgroundColor: "#440154"}}></div>
            <div className='col h12' style={{backgroundColor: "#414487"}}></div>
            <div className='col h12' style={{backgroundColor: "#2a788e"}}></div>
            <div className='col h12' style={{backgroundColor: "#22a884"}}></div>
            <div className='col h12' style={{backgroundColor: "#7ad151"}}></div>
            <div className='col h12' style={{backgroundColor: "#fde725"}}></div>
          </div>
          <div className='grid txt-s'>
            <div className='col flex-child--grow'>Low Assessment Value</div>
            <div className='col flex-child--grow align-r'>High Assessment Value</div>
          </div>
        </div>
        <div class="txt-s mt12"><a href="https://saadiqm.com/deck-gl-assessment-map-nr/">Link</a> to Non-Residental Property assessment map</div>
      </div>
    </div>
  )
}


export default SelectionContainer
