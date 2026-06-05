import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

function App() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // コンポーネントがマウントされた時に一度だけ実行
    if (sceneRef.current?.querySelector('canvas')) return;

    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

    const engine = Engine.create();
    
    // 1. レンダラーを作成
    const render = Render.create({
      element: sceneRef.current!,
      engine: engine,
      options: { width: 800, height: 600, wireframes: false }
    });

    // 2. 物体を作成
    const circle = Bodies.circle(400, 300, 30);
    const ground = Bodies.rectangle(400, 590, 800, 20, { isStatic: true });
    Composite.add(engine.world, [circle, ground]);

    // 3. マウス操作をここに追加 (renderが初期化された後なので安全)
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Composite.add(engine.world, [mouseConstraint]);

    // 4. 実行
    Render.run(render);
    Runner.run(Runner.create(), engine);

    return () => {
      Render.stop(render);
    };
  }, []);

  return <div ref={sceneRef} style={{ width: '800px', height: '600px', border: '1px solid black' }} />;
}

export default App;